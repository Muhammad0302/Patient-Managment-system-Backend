const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Organization = sequelize.define('organizations', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: DataTypes.STRING,
	contact_name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	contact_phone: {
		type: DataTypes.STRING,
		allowNull: false
	},
	contact_email: {
		type: DataTypes.STRING,
		allowNull: false
	},

	address: {
		type: DataTypes.STRING,
		allowNull: false
	},

},
	{
		indexes: [
			// Create a unique index on email
			{
				unique: true,
				fields: ['id']
			}],
	});

module.exports = Organization