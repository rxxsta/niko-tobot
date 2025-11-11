const { EmbedBuilder } = require('discord.js');
const crypto = require(crypto);

module.exports = {
	name: 'split',
	description: 'Split voice channel members into two random teams',
	aliases: ['teams'],
	usage: '[exclude...]',

	execute(message, args) {
		const voiceChannel = message.member?.voice.channel;

		if (!voiceChannel) {
			return message.reply('❌ You must be in a voice channel!');
		}

		// Parse exclude list from args (mentions or raw IDs)
		const excludeIds = new Set();
		for (const arg of args) {
			// Parse mention format: <@123456789012345678> or <@!123456789012345678>
			const mentionMatch = arg.match(/^<@!?(\d+)>$/);
			if (mentionMatch) {
				excludeIds.add(mentionMatch[1]);
				continue;
			}

			// Parse raw ID format: 123456789012345678
			if (/^\d{17,19}$/.test(arg)) {
				excludeIds.add(arg);
			}
		}

		// Get voice channel members, excluding bots and specified users
		const members = Array.from(
			voiceChannel.members.filter(m => {
				const isBot = m.user.bot;
				const isExcluded = excludeIds.has(m.id);
				return !isBot && !isExcluded;
			}).values(),
		);

		if (members.length < 2) {
			return message.reply('❌ Need at least 2 people after exclusions!');
		}

		// Fisher-Yates shuffle algorithm
		const shuffled = [...members];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = crypto.randomInt(i + 1);
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		// Split into two teams (first team gets extra if odd number)
		const midPoint = Math.ceil(shuffled.length / 2);
		const team1 = shuffled.slice(0, midPoint);
		const team2 = shuffled.slice(midPoint);

		const embed = new EmbedBuilder()
			.setTitle('🎲 Teams Split!')
			// Baby Blue
			.setColor(0x89cff0)
			.addFields(
				{
					name: `Team 1 (${team1.length})`,
					value: team1.map(m => `• ${m.user.displayName}`).join('\n'),
					inline: true,
				},
				{
					name: `Team 2 (${team2.length})`,
					value: team2.map(m => `• ${m.user.displayName}`).join('\n'),
					inline: true,
				},
			);

		// Add excluded users info if any were specified
		if (excludeIds.size > 0) {
			const excludedMentions = Array.from(excludeIds)
				.map(id => `<@${id}>`)
				.join(', ');
			embed.setFooter({ text: `Excluded: ${excludedMentions}` });
		}

		message.reply({ embeds: [embed] });
	},
};
