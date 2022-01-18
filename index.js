// Imports
const Discord = require('discord.js');
const config = require('./config/config.json');

// Discord client
var intents = [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_SCHEDULED_EVENTS
];
const client = new Discord.Client({ intents: [intents], disabledEveryone: true });

// Command collection
client.commands = new Discord.Collection();
client.slashCommands = [];

// Load utils
const getAllFiles = require('./utils/getFileLocations');

// Load commands
console.log('Loading commands..');
var commands = getAllFiles(`${__dirname}/commands/`, '.js');
for (const command of commands) {
    var cmdFile = require(command)(client, config);
    console.log(`Loading ${cmdFile.name}..`);
    if (cmdFile.data != null) client.slashCommands.push(cmdFile.data.toJSON());
    client.commands.set(cmdFile.name, cmdFile);
}
console.log(`${Array.from(client.commands.values()).length} command${Array.from(client.commands.values()).length > 1 || Array.from(client.commands.values()).length < 1 ? 's' : ''} was loaded!`);

//Loading events
console.log('Listening for events..');
events = getAllFiles(`${__dirname}/events/`, '.js');
for (const event of events) {
    eventFile = require(event)(client, config);
    if (eventFile.once) client.once(eventFile.name, async (...args) => {
        try {
            await require(event)(client, config).execute(...args);
        } catch(err) {
            if (err) console.log(err);
        }
    });
    else client.on(eventFile.name, async (...args) => {
        try {
            await require(event)(client, config).execute(...args);
        } catch(err) {
            if (err) console.log(err);
        }
    });
    console.log(`Listening on '${eventFile.name}'..`);
}
console.log('Listening for all events now!');

// Logging into the bot
client.login(config.token);