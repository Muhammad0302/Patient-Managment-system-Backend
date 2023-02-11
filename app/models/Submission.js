const bcrypt = require("bcryptjs");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Submission = sequelize.define(
  "submissions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // question_id: {
    // 	type: DataTypes.STRING,
    // 	allowNull: false
    // },
    option_response: {
      type: DataTypes.JSON,
      // allowNull: false
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

module.exports = Submission;
