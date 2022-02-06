const Sequelize = require('sequelize');
const { sqluser, sqlpass } = require('./config.json');

const sequelize = new Sequelize('discord', sqluser, sqlpass, {
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
    maxinfractions: {
        type: Sequelize.INTEGER,
        defaultValue: 2,
		allowNull: false,
    },
    manrole: {
        type: Sequelize.STRING,
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
        if (error.name === 'SequelizeUniqueConstraintError') {
            return error.name;
        }
        return error;
    }
}

async function guildTableCreate(name, max, manrole, modrole) {
    try {
        const guildtable = await guildTables.create({
            name: name,
            maxinfractions: max,
            manrole: manrole,
            modrole: modrole,
        });
        return guildtable;
    }
    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return error.name;
        }
        return error;
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

function contentcheck(message) {
    const filter = ['nigger', 'niggër', 'niggêr', 'nigg3r', 'nïgger', 'nïggër', 'nïggêr', 'nïgg3r', 'nîgger', 'nîggër', 'nîggêr', 'nîgg3r', 'n1gger', 'n1ggër', 'n1ggêr', 'n1gg3r'];
	const len = filter.length;
	for (let i = 0; i < len; i++) {
		if (message.includes(filter[i])) {
			return true;
		}
	}
	return false;
}

module.exports = { getRandomIntInclusive, objToString, randomColor, contentcheck, sequelize, userTables, guildTables, userTableCreate, guildTableCreate };
