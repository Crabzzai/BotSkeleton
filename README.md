# BotSkelet
 Skelet of a discord.js bot with mongodb integration!

Tired of making the whole "base" of your discord bot? Never been easier!


The following versions was used to test the project:
|                |VERSIONS             |
|----------------|---------------------|
|Discord.js      |`v13.6.0`            |
|Node.js         |`v17.3.0`            |

## How to get started
Install the project with the following command:
```
$ npm install
```

### MongoDB
Tired of making millions of lines just to use your database connection in whole your project? 
Now you can easily access each collection through the variable `db` in all your events, commands and if you want to use it in the root of your project (`index.js`)

You don't need to do anything else than putting in your credentials in `./config/db.json`, and then you can access each collection by their name.
Look at the example beneath:
```js
// Imports
const Discord = require('discord.js');

module.exports = (client, config, db) => {
    var cmdObj = {};

    // Settings
    cmdObj.name = 'dogs';
    cmdObj.description = 'return a number of dogs in the database';
    cmdObj.permissions = null;
    cmdObj.data = null; // We don't want to use a Slash Command for this example

    // Main function
    /**
     * @param {Discord.Message} message - Will be set if the command was executed by standard message command.
     * @param {Array<String> || Discord.CommandInteractionOptionResolver} args - If the command was executed by standard message command, it will send an array of string arguments. If executed by slash commands it will return the interaction options.
     * @param {Discord.CommandInteraction} interaction - Will be set if command was executed by a slash command.
     */
    cmdObj.execute = async (message, args, interaction) => {
        // Let's say we have a mongodb collection named "dogs", we will then access it through "db.dogs"
        let dogs = await db.dogs.find({}).toArray();

        /**
         * This will send a message to the same channel as the command was executed in,
         * with for example the following:
         * 
         * We have 101 dogs in our database!!
        */
        message.channel.send({content: `We have ${dogs.length} dogs in our database!!`});
    }

    return cmdObj;
}
```

### Events
Get started by duplicating the template named `event.js.structure` and renaming it to a new more convenient name ending on `.js`

The template include the following:
```js
module.exports = (client, config, db) => {
    var eventObj = {};

    // Settings
    eventObj.name = 'test'; // Event name
    eventObj.once = false; // Set this to true if it should listen once.

    // Main function
    eventObj.execute = () => {
        // Do something in the event here
    }

    return eventObj;
}
```
All event modules should go into the folder named `events`.

### Commands
Get started by duplicating the template named `cmd.js.structure` and renaming it to a new more convenient name ending on `.js`

The template include the following:
```js
// Imports
const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = (client, config, db) => {
    var cmdObj = {};

    // Settings
    cmdObj.name = 'test';
    cmdObj.description = 'test description';
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
    cmdObj.execute = (message, args, interaction) => {}

    return cmdObj;
}
```
This project includes both slash command handling and standard message command handling.

## Finish up
To start the project run the following command:
```
$ npm run start
```

# Important!!
If you experience any problems in your way using this awesome skeleton for your bot, don't hesitate to contact me on discord! `Croixai#2003`