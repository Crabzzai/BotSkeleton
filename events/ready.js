// Imports
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {*} config 
 * @returns 
 */
module.exports = (client, config, db) => {
    var eventObj = {};

    // Settings
    eventObj.name = 'ready'; // Event name
    eventObj.once = true; // Set this to true if it should listen once.

    // Main function
    eventObj.execute = async () => {
        console.log(`${client.user.username} is ready to use!`)
        const rest = new REST({
            version: '9'
        }).setToken(config.token);

        try {
            console.log(client.slashCommands, config.production);
            if (config.production) {
                await rest.put(Routes.applicationCommands(client.user.id), {
                    body: client.slashCommands
                });
                console.log('Successfully registered exisiting slash commands globally.');
            } else {
                await rest.put(Routes.applicationGuildCommands(client.user.id, config.guild_id), {
                    body: client.slashCommands
                });
                console.log(`Successfully registered exisiting slash commands in guild with id: ${config.guild_id}.`);
            }
        } catch (err) {
            if (err) console.error(err);
        }
    }

    return eventObj;
}