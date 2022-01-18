// Imports
const Discord = require('discord.js');

/**
 * Checking if a guild member has specified permissions
 * @param {Discord.GuildMember} member 
 * @param  {...Discord.PermissionString} perms 
 * @returns 
 */
function hasPermissions(member, ...perms) {
    for (i = 0; i < perms.length; i++) {
        if (!member.permissions.has(perms[i])) return false;
    }
    return true;
}

// Module Export
module.exports = hasPermissions;