// Imports
const Discord = require('discord.js');
const config = require('./config/config.json');
const { db_name } = require('./config/db.json');

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
client.commandCategories = {}; // Object of command categories

// Load utils
const getAllFiles = require('./utils/getFileLocations');
const db_client = require('./utils/database');

// Database setup
(async () => {
    // Connect to database
    await db_client.connect();
    console.log('Database connected successfully!');

    const database = db_client.db(db_name);
    const collections = await database.collections();

    var db = {};
    for (const collection of collections) {
        db[collection.collectionName] = collection;
    }

    // Load commands
    console.log('Loading commands..');
    var commands = getAllFiles(`${__dirname}/commands/`, '.js');
    for (const command of commands) {
        var cmdFile = require(command)(client, config, db);
        console.log(`Loading ${cmdFile.name}..`);
        if (Boolean(cmdFile.category) && !client.commandCategories[cmdFile.category]) client.commandCategories[cmdFile.category] = [cmdFile];
        else if (Boolean(cmdFile.category) && client.commandCategories[cmdFile.category]) client.commandCategories[cmdFile.category] = [...client.commandCategories[cmdFile.category], cmdFile];
        else if (!Boolean(cmdFile.category) && !client.commandCategories[config.no_category_name]) client.commandCategories[config.no_category_name] = [cmdFile];
        else client.commandCategories[config.no_category_name] = [...client.commandCategories[config.no_category_name], cmdFile];
        if (cmdFile.data != null) client.slashCommands.push(cmdFile.data.toJSON());
        client.commands.set(cmdFile.name, cmdFile);
    }
    console.log(`${Array.from(client.commands.values()).length} command${Array.from(client.commands.values()).length > 1 || Array.from(client.commands.values()).length < 1 ? 's' : ''} was loaded!`);

    //Loading events
    console.log('Listening for events..');
    events = getAllFiles(`${__dirname}/events/`, '.js');
    for (const event of events) {
        eventFile = require(event)(client, config, db);
        if (eventFile.once) client.once(eventFile.name, async (...args) => {
            try {
                await require(event)(client, config, db).execute(...args);
            } catch(err) {
                if (err) console.log(err);
            }
        });
        else client.on(eventFile.name, async (...args) => {
            try {
                await require(event)(client, config, db).execute(...args);
            } catch(err) {
                if (err) console.log(err);
            }
        });
        console.log(`Listening on '${eventFile.name}'..`);
    }
    console.log('Listening for all events now!');

    // Logging into the bot
    client.login(config.token);
})().catch(err => {
    if (err) console.error(err);
});