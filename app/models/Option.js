const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Option = sequelize.define(
  "options",
  {
    // question_id: {
    // 	type: DataTypes.INTEGER,
    // 	autoIncrement: true,
    // 	allowNull: false,
    // 	primaryKey: true
    // },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bengali: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    arabic: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    // bengali: {
    //   type: DataTypes.STRING(400),
    //   allowNull: false,
    // },
    chinese: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    english: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    french: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    german: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    greek: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    gujrati: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    hindi: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    italian: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    japanese: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    korean: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    persian: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    polish: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    portuguese: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    punjabi: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    russian: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    spanish: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    tagalog_filipino: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    vietnamese: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
  },
  {
    indexes: [
      // Create a unique index on email
      {
        fields: ["question_id"],
      },
    ],
  }
);

module.exports = Option;
