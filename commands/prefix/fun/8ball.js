/* eslint-disable no-unused-vars */
const crypto = require('crypto');
const { prefix, eightball_answers } = require('./../../../config.json');

module.exports = {
	name: '8ball',
	description: '8-Ball of Truth',
	usage: '<Question>',
	guildOnly: false,
	execute(message, args) {
		if (args.length === 0) {
			message.reply({ content: 'Usage: `' + prefix + this.name + ' ' + this.usage + '`' });
			return;
		}

		const number = crypto.randomInt(0, eightball_answers.length);
		const answer = eightball_answers[number];

		message.reply({ content: answer });
	},
};
