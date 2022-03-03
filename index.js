const { ShardingManager } = require('discord.js');
const { token } = require('./config.json');

const manager = new ShardingManager('./bot.js', { token: token });
// Create a ShardingManager

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
// Log to console when creating a shard

manager.spawn();
// Spawn a shard using the newly created Manager
