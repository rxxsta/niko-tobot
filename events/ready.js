/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
