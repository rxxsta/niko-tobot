/* eslint-disable no-unused-vars */
const axios = require('axios');
const env = require('dotenv').config();
const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'bunny',
	aliases: [ 'rabbit'],
	description: 'Shows a random bunny',
	usage: '',
	guildOnly: false,
	execute(message, args) {
		const URL = 'https://rabbit-api-two.vercel.app/api/random';

		axios.get(`${URL}`).then(response => {

			const apiData = response;
			const url = apiData.data.url;
			// Firebase urls don't render images properly
			const embed = new EmbedBuilder()
				.setImage(url);
			message.reply({ embeds: [embed] });
		}).catch((error) => {
			message.reply({ content: 'You broke it...' });
			console.log(error);
		});
	},
};
