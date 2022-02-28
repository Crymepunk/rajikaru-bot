const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, guildId, clientId } = require('./config.json');
const fs = require('fs');

// Assign commands
const commands = [];
// Get commands from ./commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	// Get command from files
	const command = require(`./commands/${file}`);
	// Push command to array
	commands.push(command.data.toJSON());
}


const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
