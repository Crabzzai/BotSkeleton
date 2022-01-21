// Imports
const Discord = require('discord.js');
const hasPermission = require('./../utils/hasPermission');

module.exports = (client, config, db) => {
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
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);

        if (!command) return;
        if (command.permissions == null || (command.permissions != null && hasPermission(message.member, command.permissions))) try {
            await command.execute(message, args, null);
        } catch (err) {
            if (err) console.error(err);
        }
    }

    return eventObj;
}