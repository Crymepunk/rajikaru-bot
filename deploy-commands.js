const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

// Assign commands
const commands = [];
// Get command folders from ./commands
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	if (folder != 'developer') {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			// Get command from files
			const command = require(`./commands/${folder}/${file}`);
			// Push command to array
			commands.push(command.data.toJSON());
		}
	}
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
