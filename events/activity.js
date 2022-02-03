module.exports = {
	name: 'activity',
	once: true,
	execute(client) {
        const wait = require('util').promisify(setTimeout);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            client.user.setActivity('your mom', { type: 'LISTENING' });
            wait(7200000);
            client.user.setActivity('Lui ASMR', { type: 'LISTENING' });
            wait(7200000);
            client.user.setActivity('The Game');
            wait(7200000);
            client.user.setActivity('Genshin Impact');
            wait(7200000);
            client.user.setActivity('Attack on Titan', { type: 'WATCHING' });
            wait(7200000);
        }
	},
};
