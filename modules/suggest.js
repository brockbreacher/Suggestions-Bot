const { RichEmbed } = require("discord.js");

exports.run = async (client, message, args) => {

    const settings = require('../settings.json');
    
    const sayMessage = args.join(" ");

    

    const embed = new RichEmbed()

      .setColor("RANDOM")

      .setTitle(`Suggestion From **${message.member.displayName}**`)

      .setDescription(sayMessage);

    

    const sentEmbed = await client.channels.get(settings.channel).send(embed);

    await sentEmbed.react("👍");

    await sentEmbed.react("👎");

    await message.channel.send(`Thank You For Your Suggestion **${message.member.displayName}**!`);

    await message.delete();

}

