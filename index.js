const Discord = require('discord.js');
const client = new Discord.Client();
client.killme = new Map();

const settings = require('./settings.json');
const prefix = settings.prefix 

function* InfiniteGenerator(array) {
	while (true) {
		for (const item of array) {
			yield item;
		}
	}
}

client.on('ready', () => {
     console.log("change this part") // needed for startup i think
	const statuses = [
		() => ['WATCHING', `People Type ` + settings.prefix + `help`],
		() => ['WATCHING', `${client.users.size} Members`],
	];

	const gen = InfiniteGenerator(statuses);
	client.setInterval(() => {
		const item = gen.next().value;
		const [type, message] = item();

		client.user.setActivity(message, { type });
	}, 60000);
});

client.on("message", async message => {
    if (message.author.bot) return

    if(!message.content.toLowerCase().startsWith(prefix)) return;
    try {
        if(message.content == "") throw "empty";
    } catch (err) {
		message.reply('');
	}
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	console.log(`Running ${command}..`);
	try {
    const commandFile = require(`./modules/${command}.js`)
		commandFile.run(client, message, args);
		console.log(`Ran ${command}!`);
	} catch (err) {
		console.log(err);
		client.channels.get('718002805616672828').send('' + err);
	}
});


client.login(settings.token);
