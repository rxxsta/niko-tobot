/* eslint-disable no-unused-vars */
const { prefix } = require('./../../../config.json');

module.exports = {
	name: 'avatar',
	description: 'Displays a user\'s avatar',
	usage: '@<Username>',
	guildOnly: false,
	async execute(message, args) {
		const members = message.mentions.users;
		if (members.size !== 1) {
			message.reply({ content: 'Usage: `' + prefix + this.name + ' ' + this.usage + '`' });
			return;
		}
		const member = members.first();

		const memberAvatar = member.displayAvatarURL({ size: 2048, dynamic: true });

		message.channel.send({ files: [memberAvatar] });
	},
};
