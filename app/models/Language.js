const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Language = sequelize.define('languages', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		name: DataTypes.STRING,
		type: {
			type: DataTypes.STRING,
			allowNull: false
		}
  	},
	{
		indexes: [
			// Create a unique index on email
			{
				unique: true,
				fields: ['id']
			}],
	});

module.exports = Language;