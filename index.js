const { Client, Collection, GatewayIntentBits } = require('discord.js');
// Node's native file system module (https://nodejs.org/api/fs.html)
const fs = require('fs');
// Node's native path module (https://nodejs.org/api/path.html)
const path = require('path');
// environment variables, unseen to the naked eye
// eslint-disable-next-line no-unused-vars
const env = require('dotenv').config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	//		GatewayIntentBits.GuildVoiceStates,
	],
});

client.commands = new Collection();

// initialize client.commands for prefixes
const commandsPath = path.join(__dirname, 'commands/prefix');
const commandFolders = fs.readdirSync(commandsPath);
for (const folder of commandFolders) {

	// The fs.readdirSync() method will return an array of all the file names in a directory, e.g. ['ping.js', 'beep.js']
	// .filter() makes sure we only use command files
	const commandFilesPath = path.join(commandsPath, folder);
	const commandFiles = fs.readdirSync(commandFilesPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const commandPath = path.join(commandFilesPath, file);
		const command = require(commandPath);

		// set a new item in the client.commands Collection
		// with the key as the command name and the value as the exported module
		client.commands.set(command.name, command);
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.DISCORD_TOKEN);
