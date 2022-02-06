const Sequelize = require('sequelize');
const { sqluser, sqlpass } = require('./config.json');

const sequelize = new Sequelize('discord', sqluser, sqlpass, {
	host: 'localhost',
	dialect: 'mariadb',
	logging: false,
});


const Tables = sequelize.define('', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
    infractions: Sequelize.ARRAY(Sequelize.STRING),
    maxinfractions: Sequelize.NUMBER,
});

async function userTableCreate(name, infractions, num, max) {
try {
	// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
	const table = await Tables.create({
		name: name,
        infractions: infractions,
        infractionsnum: num,
        maxinfractions: max,
	});
    return table;
}
catch (error) {
	if (error.name === 'SequelizeUniqueConstraintError') {
		return error.name;
	}

	return error;
}}

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

module.exports = { getRandomIntInclusive, objToString, randomColor, contentcheck, sequelize, Tables, userTableCreate };
