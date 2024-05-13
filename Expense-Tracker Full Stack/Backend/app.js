const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./utils/database");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");

const userRoutes = require("./routes/users");
const expenseRoutes = require("./routes/expenses");
const purchaseRoutes = require("./routes/purchase");
const premiumRoutes = require("./routes/premiumFeatures");

const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

sequelize
  .sync()
  .then((result) => {
    app.listen(8000, () => {
      console.log("Serer started at port 8000");
    });
  })
  .catch((err) => {
    console.log(err);
  });