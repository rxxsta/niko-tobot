/* eslint-disable no-unused-vars */
const fs = require('fs');
const crypto = require('crypto');
const winstonFolder = fs.readdirSync('./media/winston');

module.exports = {
	name: 'winston',
	description: 'Random Winston pictures',
	usage: '',
	guildOnly: false,
	execute(message, args) {
		const winstonPictures = [];
		for (const winstonPicture of winstonFolder) {
			winstonPictures.push(winstonPicture);
		}
		const number = crypto.randomInt(0, winstonPictures.length);

		const randomPicture = winstonPictures[number];

		message.reply({ files: ['./media/winston/' + randomPicture] });
	},
};
