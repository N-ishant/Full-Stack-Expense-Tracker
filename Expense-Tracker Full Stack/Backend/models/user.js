const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },

  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  ispremiumuser: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },

  totalExpenses: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;