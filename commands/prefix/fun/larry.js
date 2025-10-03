/* eslint-disable no-unused-vars */
const fs = require('fs');
const crypto = require('crypto');
const larryFolder = fs.readdirSync('./media/larry');

module.exports = {
	name: 'larry',
	aliases: ['larebear'],
	description: 'Shows a random larry',
	usage: '',
	guildOnly: false,
	execute(message, args) {
		const larryPictures = [];
		for (const larryPicture of larryFolder) {
			larryPictures.push(larryPicture);
		}
		const number = crypto.randomInt(0, larryPictures.length);

		const randomPicture = larryPictures[number];

		message.reply({ files: ['./media/larry/' + randomPicture] });
	},
};
