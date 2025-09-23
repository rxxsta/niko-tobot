/* eslint-disable no-unused-vars */
const fs = require('fs');
const path = require('path');
const { prefix } = require('./../../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Lists commands',
	usage: '',
	guildOnly: false,
	execute(message, args) {
		const commandHelp = [];

		const commandFoldersPath = path.join(__dirname, '../');
		const commandFolders = fs.readdirSync(commandFoldersPath);
		for (const folder of commandFolders) {

			// The fs.readdirSync() method will return an array of all the file names in a directory, e.g. ['ping.js', 'beep.js']
			// .filter() makes sure we only use command files
			const commandFilesPath = path.join(commandFoldersPath, folder);
			const commandFiles = fs.readdirSync(commandFilesPath).filter(file => file.endsWith('.js'));

			for (const file of commandFiles) {
				const commandPath = path.join(commandFilesPath, file);
				const command = require(commandPath);

				commandHelp.push(command);
			}
		}

		const fields = [];
		for (const command of commandHelp) {
			fields.push({
				name: '`' + prefix + command.name + '`',
				value: command.description,
				inline: true,
			});
		}
		const embed = {
			// baby blue
			color: 0x89cff0,
			title: 'List of Supported Commands',
			fields: fields,
		};

		message.channel.send({ embeds: [embed] });
	},
};
