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
		() => ['WATCHING', `People Type 'settings.prefix'!help`],
		() => ['WATCHING', `${client.users.size} Members`],
	];

	const gen = InfiniteGenerator(statuses);
	client.setInterval(() => {
		const item = gen.next().value;
		const [type, message] = item();

		client.user.setActivity(message, { type });
	}, 60000);
});


//Join Log
client.on("guildMemberAdd", member => {
  const wChannel = member.guild.channels.find(ch => ch.name === "join-log");
  if (!wChannel) return console.log("Cannot Find Channel");

  const staffUsers = member.guild.roles
    .find(s => s.name === "Admin")
    .members.map(m => m.user.username);
  const staffInServer = staffUsers.length;
  const staffUsernamesFormatted = staffUsers.join(",\n");

  var dgj = member.guild.joinedAt,
    userJoinedGuildAt =
      [dgj.getHours(), dgj.getMinutes(), dgj.getSeconds()].join(":") +
      " " +
      [dgj.getMonth() + 1, dgj.getDate(), dgj.getFullYear()].join("/") +
      " GMT";

  var d = member.user.createdAt,
    userSearchedAccountCreatedDateAndTime =
      [d.getHours(), d.getMinutes(), d.getSeconds()].join(":") +
      " " +
      [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/") +
      " GMT";

  const embed = new Discord.RichEmbed()
    .setTitle(`Welcome ${member.user.username}!`)
    .setColor(0x008000)
    .setDescription(
      `Welcome!`
    )
    .setImage()
    .setThumbnail(member.user.avatarURL)
    .setTimestamp()
    .addField("Time Joined:", userJoinedGuildAt, true)
    .addField("Total Members", member.guild.memberCount, true);

  wChannel.send(embed);
});

client.on("guildMemberRemove", member => {
  const wChannel = member.guild.channels.find(ch => ch.name === "join-log");
  if (!wChannel) return console.log("Cannot Find Channel");

  var dgj = member.guild.joinedAt,
    userJoinedGuildAt =
      [dgj.getHours(), dgj.getMinutes(), dgj.getSeconds()].join(":") +
      " " +
      [dgj.getMonth() + 1, dgj.getDate(), dgj.getFullYear()].join("/") +
      " GMT";

  const embed = new Discord.RichEmbed()
    .setTitle(`${member.user.username} left!`)
    .setColor(0xff0000)
    .setDescription(`Bye!`)
    .setImage()
    .setThumbnail(member.user.avatarURL)
    .setTimestamp()
    .addField("Total Members", member.guild.memberCount, true);

  wChannel.send(embed);
});
//JoinLog End

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
