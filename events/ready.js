const { userTable, sequelize, guildTable } = require('../functions');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		try {
			await sequelize.authenticate();
			console.log('Connection has been established successfully.');
		} catch (error) {
			console.error('Unable to connect to the database:', error);
		}
		userTable.sync({ force: true });
		guildTable.sync({ force: true });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
