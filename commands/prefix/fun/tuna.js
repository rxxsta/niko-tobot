/* eslint-disable no-unused-vars */
const fs = require('fs');
const crypto = require('crypto');
const mstunaFolder = fs.readdirSync('./media/mstuna');

module.exports = {
	name: 'tuna',
	description: 'Random Ms. Tuna pictures',
	usage: '',
	guildOnly: false,
	execute(message, args) {
		const mstunaPictures = [];
		for (const mstunaPicture of mstunaFolder) {
			mstunaPictures.push(mstunaPicture);
		}
		const number = crypto.randomInt(0, mstunaPictures.length);

		const randomPicture = mstunaPictures[number];

		message.reply({ files: ['./media/mstuna/' + randomPicture] });
	},
};
