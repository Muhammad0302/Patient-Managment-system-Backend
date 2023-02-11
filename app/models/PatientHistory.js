const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const PatientHistory = sequelize.define('PatientHistory', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	language: {
		type: DataTypes.STRING,
		allowNull: true
	},
	age: {
		type: DataTypes.STRING,
		allowNull: true
	},
	gender: {
		type: DataTypes.STRING,
		allowNull: true
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

module.exports = PatientHistory