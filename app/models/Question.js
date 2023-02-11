const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Question = sequelize.define(
  "questions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    question_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    bengali: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    arabic: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    bengali: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    chinese: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    english: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    french: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    german: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    greek: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    gujrati: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    hindi: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    italian: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    japanese: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    korean: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    persian: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    polish: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    portuguese: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    punjabi: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    russian: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    spanish: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    tagalog_filipino: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    vietnamese: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
  },
  {
    indexes: [
      // Create a unique index on email
      {
        unique: true,
        fields: ["id"],
      },
    ],
  }
);

module.exports = Question;
