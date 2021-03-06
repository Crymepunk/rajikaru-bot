const { MessageEmbed, Permissions } = require('discord.js');
const Sequelize = require('sequelize');
const { sqluser, sqlpass, sqldb } = require('./config.json');

// Create a new sequelize connection using mariadb
const sequelize = new Sequelize(sqldb, sqluser, sqlpass, {
	host: 'localhost',
	dialect: 'mariadb',
	logging: false,
});

// Define userTables
const userTables = sequelize.define('usertables', {
	name: {
		type: Sequelize.STRING,
		unique: true,
        allowNull: false,
	},
    infractions: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
});

// Define guildTables
const guildTables = sequelize.define('guildtables', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    modrole: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    manrole: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    maxinfractions: {
        type: Sequelize.INTEGER,
        defaultValue: 3,
		allowNull: false,
    },
    mutedrole: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    disabledcommands: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

/* Define punTables
TODO: everything */
const punTables = sequelize.define('puntables', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    punishment: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    expiration: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});

// Function to easily create a new usertable
async function userTableCreate(name, infractions) {
    try {
        const usertable = await userTables.create({
            name: name,
            infractions: infractions,
        });
        return usertable;
    }
    catch (error) {
        console.log(error);
    }
}

// Function to easily create a new guildtable
async function guildTableCreate(name, max, manrole, modrole, mutedrole, disabledcommands) {
    try {
        const guildtable = await guildTables.create({
            name: name,
            maxinfractions: max,
            manrole: manrole,
            modrole: modrole,
            mutedrole: mutedrole,
            disabledcommands: disabledcommands,
        });
        return guildtable;
    }
    catch (error) {
        console.log(error);
    }
}

/*
Function to generate random numbers:
console.log(getRandomIntInclusive(1, 3));
returns 1, 2 or 3
*/
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to turn objects to string, used for nekos.life api
function objToString(object) {
    let str = '';
    for (const k in object) {
        // eslint-disable-next-line no-prototype-builtins
        if (object.hasOwnProperty(k)) {
            str += object[k];
        }
    }
    return str;
}

// Generate a random hex color for use in embeds
const randomColor = () => {
    let color = '';
    for (let i = 0; i < 6; i++) {
       const random = Math.random();
       const bit = (random * 16) | 0;
       color += (bit).toString(16);
    }
    return color;
};

// Check messages... Used in say and owoify
function contentcheck(message, filter) {
	const len = filter.length;
	for (let i = 0; i < len; i++) {
		if (message.includes(filter[i])) {
			return true;
		}
	}
	return false;
}

// infractionlist function, makes a readable list in string form using an array.
function infractionlist(infractions, limit) {
    let str = '';
    for (let i = 0; i <= infractions.length - 1; i++) {
        const x = i + 1;
        if (i == limit) {
            return str;
        } else if (i == 0) {
            str += `${infractions.slice(-1)} \n`;
        } else {
            str += `${infractions.slice(-x, -i)} \n`;
        }
    }
    return str;
}

// errembed function, makes a standard error embed. Used for all errors in the bot
function errembed({ interaction, author, desc, defer }) {
    let emb = new MessageEmbed()
    .setColor('#CC0000');
    if (author) {
        emb = emb.setAuthor({ name: author });
    }
    if (desc) {
        emb = emb.setDescription(desc);
    }
    if (defer == true) {
        return interaction.editReply({ embeds: [emb], ephemeral: true });
    } else {
        return interaction.reply({ embeds: [emb], ephemeral: true });
    }
}

// dmpunembed function, makes an embed to DM to user when they have been punished.
function dmpunembed({ interaction, reason = null, punishmenttext }) {
    const title = `${punishmenttext.charAt(0).toUpperCase()}${punishmenttext.slice(1).toLowerCase()}`;
    const emb = new MessageEmbed()
    .setTitle(title)
    .setDescription(`You have been ${punishmenttext} in ${interaction.guild.name}!`);
    if (punishmenttext === 'banned' || punishmenttext == 'muted') {
        emb.setColor('#CC0000');
        emb.addField('Duration:', 'Permanent', true);
    }
    if (punishmenttext !== 'unbanned' && punishmenttext !== 'unmuted') {
        emb.addField('Reason:', reason, true);
    } else if (punishmenttext == 'unbanned' || punishmenttext == 'unmuted') {
        emb.setColor('GREEN');
    }
    return emb;
}

// punembed function, makes an embed to send in the server when a user has been punished.
function punembed({ member, reason = null, punishmenttext }) {
    const title = `${punishmenttext.charAt(0).toUpperCase()}${punishmenttext.slice(1).toLowerCase()}`;
    const emb = new MessageEmbed()
    .setTitle(title)
    .setColor('#5B92E5')
    .setDescription(`${member} has been ${punishmenttext}!`)
    .setThumbnail(`${member.user.avatarURL()}`);
    if (punishmenttext == 'banned' || punishmenttext == 'muted') {
        emb.addField('Duration:', 'Permanent', true);
    }
    if (punishmenttext !== 'unbanned' && punishmenttext !== 'unmuted') {
        emb.addField('Reason:', reason, true);
    }
    return emb;
}

/*
Permcheck function.
Checks permissions of the given user and has multiple checks to make it usable in most commands.
TODO: Make this less complicated if possible.
*/
async function permcheck({ interaction, member, selfcheck, permflag, manonly, roleposcheck, defer }) {
    let brole; let usrole;
    let memrole;
    if (member) {
        brole = interaction.guild.me.roles.highest;
        usrole = interaction.member.roles.highest;
        memrole = member.roles.highest;
        if (member.user.bot) {
            return (errembed({ interaction: interaction, author: 'This member is a bot!', defer: defer }), true);
        }
    }
    const owner = await interaction.guild.fetchOwner();

    if (interaction.member != owner) {
        const guildTableName = String(interaction.guild.id + '-guild');
        const guildtable = await guildTables.findOne({ where: { name: guildTableName } });
        let modrole; let manrole;
        let modroles;
        if (guildtable) {
            modrole = await guildtable.get('modrole');
            manrole = await guildtable.get('manrole');
        }

        // If command can be used by only Managers or both Moderators and Managers
        if (manonly == true) {
            modroles = [manrole];
        } else {
            modroles = [modrole, manrole];
        }

        // If it should check if user is member or not
        if (selfcheck == true && member) {
            // Check if member is sender and if so send an error message
            if (interaction.member == member) {
                return (errembed({ interaction: interaction, author: `Please ping someone other than yourself!`, defer: defer }), true);
            }
        }

        // If permflag exists check for permissions
        if (permflag) {
            if (!interaction.member.permissions.has(permflag)) {
                if (!contentcheck(interaction.member._roles, modroles)) {
                    return (errembed({ interaction: interaction, author: 'You are missing the required permissions!', defer: defer }), true);
                }
                // Check for modrole and or manrole and if not check role positions
            } else if (!contentcheck(interaction.member._roles, modroles)) {
                if (member && usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
                    return (errembed({ interaction: interaction, author: `Cannot use this on a member with the same or a higher rank than you`, desc: '||Unless you have set a modrole with /settings modrole||', defer: defer }), true);
                }
            }
        // Else just check for modrole or manrole
        } else if (!contentcheck(interaction.member._roles, modroles)) {
            return (errembed({ interaction: interaction, author: 'You are missing the required permissions!', defer: defer }), true);
        }

        // Check that member isnt a moderator
        if (member && contentcheck(member._roles, modroles) || member && member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return (errembed({ interaction: interaction, author: 'This member is a Moderator!', defer: defer }), true);
        }
    }
    // Check if bot should check its own role position against the member's
        // Check positions
    if (roleposcheck != false && member && brole.comparePositionTo(memrole) <= memrole.comparePositionTo(brole)) {
        // Error if it cant execute
        return (errembed({ interaction: interaction, author: `This member's highest role is higher than my highest role`, defer: defer }), true);
    }
    return false;
}

// updateroles function, updates user(s) roles when a role like "Muted" has been changed.
async function updateroles({ interaction, previousRole, newRole }) {
    for (let member of await interaction.guild.members.fetch()) {
        member = member.at(1);
        if (previousRole && member._roles.includes(previousRole.id)) {
            await member.roles.remove(previousRole);
            await member.roles.add(newRole);
        } else {
            await member.roles.add(newRole);
        }
    }
}

// Function to remove an item from an array.
function removeItemOnce(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

// Define bot commands, used for disabling commands among other things..
const botCommands = ['help', 'avatar', 'userinfo', 'serverinfo', 'ping', 'settings', 'role', 'ban', 'unban', 'kick', 'mute', 'unmute', 'warn', 'infractions', 'purge', 'nick', 'say', 'cuddle', 'hug', 'pat', 'slap', 'neko', 'coinflip', '8ball', 'owoify', 'gayrate'];

// Export all functions/variables
module.exports = { getRandomIntInclusive, objToString, randomColor, contentcheck, sequelize, userTables, guildTables, punTables, userTableCreate, guildTableCreate, errembed, dmpunembed, punembed, infractionlist, permcheck, updateroles, botCommands, removeItemOnce };
