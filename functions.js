const { MessageEmbed, Permissions } = require('discord.js');
const Sequelize = require('sequelize');
const { sqluser, sqlpass, sqldb } = require('./config.json');

const sequelize = new Sequelize(sqldb, sqluser, sqlpass, {
	host: 'localhost',
	dialect: 'mariadb',
	logging: false,
});

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

// TODO: everything
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
        type: Sequelize.TIME,
        allowNull: true,
    },
    expiretime: {
        type: Sequelize.DATE,
        allowNull: true,
    },
});

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

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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

const randomColor = () => {
    let color = '';
    for (let i = 0; i < 6; i++) {
       const random = Math.random();
       const bit = (random * 16) | 0;
       color += (bit).toString(16);
    }
    return color;
};

function contentcheck(message, filter) {
	const len = filter.length;
	for (let i = 0; i < len; i++) {
		if (message.includes(filter[i])) {
			return true;
		}
	}
	return false;
}

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

function punembed({ interaction, reason = null, punishmenttext }) {
    const title = () => `${punishmenttext.charAt(0).toUpperCase()}${punishmenttext.slice(1).toLowerCase()}`;
    const emb = new MessageEmbed()
    .setColor('#CC0000')
    .setTitle(title.toString())
    .setDescription(`You have been ${punishmenttext} from ${interaction.guild.name}!`);
    if (punishmenttext === 'banned' && punishmenttext == 'muted') {
        emb.addFields({ name: 'Duration:', value: 'Permanent', inline: true });
    } else if (punishmenttext !== 'unbanned' && punishmenttext !== 'unmuted') {
        emb.addFields({ name: 'Reason:', value: reason, inline: false });
    }
}

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
    const owner = interaction.guild.fetchOwner();

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
        if (selfcheck == true) {
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
                if (member) {
                    if (usrole.comparePositionTo(memrole) <= memrole.comparePositionTo(usrole)) {
                        return (errembed({ interaction: interaction, author: `Cannot use this on a member with the same or a higher rank than you`, desc: '||Unless you have set a modrole with /settings modrole||', defer: defer }), true);
                    }
                }
            }
        // Else just check for modrole or manrole
        } else if (!contentcheck(interaction.member._roles, modroles)) {
            return (errembed({ interaction: interaction, author: 'You are missing the required permissions!', defer: defer }), true);
        }

        // Check that member isnt a moderator
        if (member) {
            if (contentcheck(member._roles, modroles) || member && member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
                return (errembed({ interaction: interaction, author: 'This member is a Moderator!', defer: defer }), true);
            }
        }
    }
    // Check if bot should check its own role position against the member's
    if (roleposcheck != false) {
        // Check positions
        if (brole.comparePositionTo(memrole) <= memrole.comparePositionTo(brole)) {
            // Error if it cant execute
            return (errembed({ interaction: interaction, author: `This member's highest role is higher than my highest role`, defer: defer }), true);
        }
    }
    return false;
}

async function updateroles({ interaction, previousRole, newRole }) {
    for (let member of await interaction.guild.members.fetch()) {
        member = member.at(1);
        if (member._roles.includes(previousRole.id)) {
            await member.roles.remove(previousRole);
            await member.roles.add(newRole);
        }
    }
}

function removeItemOnce(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

const botCommands = ['help', 'avatar', 'userinfo', 'serverinfo', 'ping', 'settings', 'role', 'ban', 'unban', 'kick', 'mute', 'unmute', 'warn', 'infractions', 'purge', 'nick', 'say', 'cuddle', 'hug', 'pat', 'slap', 'neko', 'coinflip', '8ball', 'owoify', 'gayrate'];
module.exports = { getRandomIntInclusive, objToString, randomColor, contentcheck, sequelize, userTables, guildTables, punTables, userTableCreate, guildTableCreate, errembed, punembed, infractionlist, permcheck, updateroles, botCommands, removeItemOnce };
