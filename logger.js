const tmi = require('tmi.js');
const fs = require('fs');
const process = require('process');
const {tIdentity, tOptions, tChannels, filterRegex, prefix, suffix} = require('./config.json');
const writeStreams = new Map();
const client = new tmi.Client({
	options: tOptions,
	identity: tIdentity,
	channels: tChannels
});

tChannels.forEach(e => {
	e = e.replace('#','');
	let stream = fs.createWriteStream('./'+ e +'.txt', {flags:'a'});
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