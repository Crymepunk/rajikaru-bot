const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { errembed } = require('./functions');

// Create a client with the required intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS], shards: 'auto' });

// Set commands as a new Collection
client.commands = new Collection();

// Get the folders from commands/
const commandFolders = fs.readdirSync('./commands');

// For loop for each folder in commands/
for (const folder of commandFolders) {
	// Get commandfiles inside of the folder from commands/
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

	// For loop for each command in commandFiles
	for (const file of commandFiles) {
		// Grab the command from the file
		const command = require(`./commands/${folder}/${file}`);
		// Set a new item in the Collection
		// With the key as the command name and the value as the exported module
		client.commands.set(command.data.name, command);
	}
}

// Get event files from ./events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// For loop for each event file in events/
for (const file of eventFiles) {
	// Grab command from events/
	const event = require(`./events/${file}`);
	// Execute event
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Interaction event to handle incomming commands
client.on('interactionCreate', async interaction => {
	// Check if interaction is a command
	if (!interaction.isCommand()) return;

	// Get all the commands from the collection
	const command = client.commands.get(interaction.commandName);

	// If its not a command in the collection then return
	if (!command) return;

	// Try executing command
	try {
		await command.execute(interaction);
	// catch errors, send an error message and send the error to console
	} catch (error) {
		console.error(error);
		// Create a new error embed using the function from functions.js
		errembed({ interaction: interaction, author: 'There was an error while executing this command!' });
	}
});

// Login to the client using the token from config.json
client.login(token);
