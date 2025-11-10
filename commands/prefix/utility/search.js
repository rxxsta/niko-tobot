/* eslint-disable no-unused-vars */
const axios = require('axios');
const env = require('dotenv').config();
const { prefix } = require('./../../../config.json');

module.exports = {
	name: 'search',
	description: 'Search the web on Discord!',
	usage: '<query>',
	guildOnly: false,
	execute(message, args) {
		if (args.length === 0) {
			message.reply({ content: 'Usage: `' + prefix + this.name + ' ' + this.usage + '`' });
			return;
		}
		const URL = 'https://kagi.com/mother/context';
		const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
		const cookie = `kagi_session=${process.env.KAGI_TOKEN}`;
		const query = args.join(' ');

		// Empty POST body
		axios.post(URL, {
		}, {
			params: {
				// axios auto URL encodes
				q: query,
			},
			headers: {
				'User-Agent': userAgent,
				'Accept': 'application/vnd.kagi.stream',
				'Accept-Language': 'en-US,en;q=0.5',
				'Accept-Encoding': 'gzip, deflate, br, zstd',
				// Kagi URL encodes the referer
				'Referer': 'https://kagi.com/search?q=' + new URLSearchParams(query),
				'Origin': 'https://kagi.com',
				'DNT': '1',
				'Cookie': cookie,
				'Sec-GPC': '1',
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				'Priority': 'u=4',
				'Content-Length': '0',
				'TE': 'trailers',
			},
		}).then(response => {
			// First line in response contains some metadata
			// Second line contains new_message.json
			const message_line = response.data.split('\n')[1];
			// Parse new_message.json and remove the weird null bytes
			const new_message = (message_line.substring(message_line.indexOf(':') + 1)).replace('\x00', '');

			// The actual JSON
			const json = JSON.parse(new_message);

			// AI summary from search
			const reply = json.md + '\n';
			// References
			// Wrap the urls in <> to prevent embeds in message.reply()
			const references = json.references_md.replace(/\]\((https?:\/\/[^)]+)\)/g, '](<$1>)');
			const fullContent = reply + references;
			// Discord has a max message length of 2000 characters...
			const maxLength = 2000;

			// If the reply is <= maxLength then cool
			if (fullContent.length <= maxLength) {
				return message.reply({ content: fullContent });
			}
			// ELSE we gotta split stuff

			// Split into chunks by lines
			const lines = fullContent.split('\n');
			const chunks = [];
			let currentChunk = '';

			for (const line of lines) {
			// If adding this line would exceed limit, start new chunk
				if (currentChunk.length + line.length + 1 > maxLength) {
					if (currentChunk) {
						chunks.push(currentChunk);
						currentChunk = '';
					}
				}

				// Add line to current chunk
				currentChunk += (currentChunk ? '\n' : '') + line;

				// If single line is too long, force split it
				if (currentChunk.length > maxLength) {
					chunks.push(currentChunk.slice(0, maxLength));
					currentChunk = currentChunk.slice(maxLength);
				}
			}

			// Add remaining content
			if (currentChunk) {
				chunks.push(currentChunk);
			}
			// reduce() executes stuff on each element in array by index
			// reply() in first chunk in loop
			// send() for the rest of the message
			// Promise for guaranteed order
			return chunks.reduce((promise, chunk, index) => {
				return promise.then(() => {
					return index === 0
						? message.reply({ content: chunk })
						: message.channel.send({ content: chunk });
				});
			}, Promise.resolve());
		}).catch((error) => {
			message.reply({ content: 'You broke it...' });
			console.log(error);
		});
	},
};
