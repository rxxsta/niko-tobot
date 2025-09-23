/* eslint-disable no-unused-vars */
const fs = require('fs');
const crypto = require('crypto');
const sealFolder = fs.readdirSync('./media/seal');

module.exports = {
	name: 'seal',
	description: 'Shows a random seal',
	usage: '',
	guildOnly: false,
	execute(message, args) {
		const sealPictures = [];
		for (const sealPicture of sealFolder) {
			sealPictures.push(sealPicture);
		}
		const number = crypto.randomInt(0, sealPictures.length);

		const randomPicture = sealPictures[number];

		message.reply({ files: ['./media/seal/' + randomPicture] });
	},
};
