const tmi = require('tmi.js');
const fs = require('fs');
const process = require('process');
const { username, twitchAuth, logging, channels, filterRegex, prefix, suffix} = require('./config.json');
const writeStreams = new Map();
const client = new tmi.Client({
	options: { debug: logging },
	identity: {
		username: username,
		password: twitchAuth
	},
	channels: channels
});

channels.forEach(e => {
	e = e.replace('#','');
	let stream = fs.createWriteStream('./utils/logger/'+ e +'.txt', {flags:'a'});
	writeStreams.set(e, stream);
})

const filter = new RegExp(filterRegex);

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
	if(self) return;

	if(filter.test(message))
	{
		let stream = writeStreams.get(channel.replace('#',''));
		stream.write(prefix + message + suffix + '\n');
	}
});

//Possibly redundant, better safe than sorry
process.on('exit', function(){
	writeStreams.forEach(e => {
		e.close();
	})
})