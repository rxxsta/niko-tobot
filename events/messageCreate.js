// for configurations variables that are public
const { prefix } = require('./../config.json');
const { Events } = require('discord.js');

// Create an event listener for messages
module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		const client = message.client;
		if (message.author.bot) return;
		if (message.content.includes('@here') || message.content.includes('@everyone')) return false;

		// ----------- HANDLES COMMANDS WITH PREFIX AFTER THIS POINT -------------
		if (!message.content.startsWith(prefix)) return;

		// holds any arguments e.g. ?weather houston ; where houston is an arg
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// if a command given by user is not in our commands folder or in the aliases section then return
		if (!command) return;

		try {
		// executes the execute() function of the command
			command.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply('There was an error trying to execute that command!');
		}
	},
};
