// Imports
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = (client, config) => {
    var cmdObj = {};

    // Settings
    cmdObj.name = 'help'; // The name of the command 
    cmdObj.description = 'tired of guessing? get help now!'; // A short description of what the command do
    cmdObj.category = 'Helpful Commands'; // Which category the command belongs to
    cmdObj.permissions = null;
    cmdObj.data = new SlashCommandBuilder()
        .setName(cmdObj.name)
        .setDescription(cmdObj.description); // Build properties for a Slash Command here if wanted. If not, set the property to null

    // Main function
    /**
     * @param {Discord.Message} message - Will be set if the command was executed by standard message command.
     * @param {Array<String> || Discord.CommandInteractionOptionResolver} args - If the command was executed by standard message command, it will send an array of string arguments. If executed by slash commands it will return the interaction options.
     * @param {Discord.CommandInteraction} interaction - Will be set if command was executed by a slash command.
     */
    cmdObj.execute = (message, args, interaction) => {
        // Creates the base of our embed message
        const embed = new Discord.MessageEmbed()
            .setTitle('Help Menu!')
            .setColor('#FF6700');
        
        // Add current prefix section if prefix is set
        if (config.prefix !== "") {
            embed.addField('Current Prefix',`The current prefix is: \`${config.prefix}\``,false)
        }
        
        // Looping through the collected categories to setup the help menu
        for (const [category, cmds] of Object.entries(client.commandCategories)) {
            let cmdStr = ``;
            for (var i = 0; i < cmds.length; i++) {
                cmdStr += `\`${cmds[i].name}\`: ${cmds[i].description}${i == (cmds.length - 1) ? '' : '\r\n'}`;
            }

            // Ads the category with the commands to embed message
            embed.addField(category, cmdStr, false);
        }

        // Sends the message
        message.channel.send({embeds: [embed]});
    }

    return cmdObj;
}
