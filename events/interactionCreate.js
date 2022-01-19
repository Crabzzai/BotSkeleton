// Imports
const Discord = require('discord.js');
const hasPermission = require('./../utils/hasPermission');

module.exports = (client, config, db) => {
    var eventObj = {};

    // Settings
    eventObj.name = 'interactionCreate'; // Event name
    eventObj.once = false; // Set this to true if it should listen once.

    // Main function
    /**
     * 
     * @param {Discord.CommandInteraction} interaction 
     * @returns 
     */
    eventObj.execute = async (interaction) => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;
        if (command.permissions == null || (command.permissions != null && hasPermission(interaction.member, command.permissions))) try {
            await command.execute(null, interaction.options, interaction);
        } catch (err) {
            if (err) console.error(err);
        }
    }

    return eventObj;
}