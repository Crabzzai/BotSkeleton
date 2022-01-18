// Imports
const Discord = require('discord.js');
const hasPermission = require('./../utils/hasPermission');

module.exports = (client, config) => {
    var eventObj = {};

    // Settings
    eventObj.name = 'messageCreate'; // Event name
    eventObj.once = false; // Set this to true if it should listen once.

    // Main function
    /**
     * @param {Discord.Message} message
     */
    eventObj.execute = async (message) => {
        if (message.author.bot) return;
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        if (client.commands.get(command) && (client.commands.get(command).permissions == null || (client.commands.get(command).permissions != null && hasPermission(message.member, client.commands.get(command).permissions)))) client.commands.get(command).execute(message, args, null);
    }

    return eventObj;
}