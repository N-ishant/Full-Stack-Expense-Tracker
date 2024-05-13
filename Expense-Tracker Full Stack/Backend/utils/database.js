const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense-tracker", "root", "Nishantkao@12", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;