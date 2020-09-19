exports.run = async (client, message, args) => {

const settings = require('../settings.json');

message.channel.send(settings.prefix + "suggest <suggestion>")
}
