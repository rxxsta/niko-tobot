/* eslint-disable no-unused-vars */
const axios = require('axios');
const env = require('dotenv').config();

module.exports = {
	name: 'dog',
	aliases: ['bark'],
	description: 'Shows a random dog',
	usage: '',
	guildOnly: false,
	execute(message, args) {
		const URL = 'https://api.thedogapi.com/v1/images/search';

		axios.get(`${URL}`).then(response => {

			const apiData = response;
			const url = apiData.data[0].url;

			message.reply({ files: [url] });
		}).catch((error) => {
			message.reply({ content: 'You broke it...' });
			console.log(error);
		});
	},
};
