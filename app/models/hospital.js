const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Hospital = sequelize.define('hospitals', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		name: DataTypes.STRING,
        Address: DataTypes.STRING,
        cityName: DataTypes.STRING,
        countryName: DataTypes.STRING,
        Province: DataTypes.STRING,
        zipCode: DataTypes.STRING
  	},
	{
		indexes: [
			// Create a unique index on email
			{
				unique: true,
				fields: ['id']
			}],
	});

module.exports = Hospital;