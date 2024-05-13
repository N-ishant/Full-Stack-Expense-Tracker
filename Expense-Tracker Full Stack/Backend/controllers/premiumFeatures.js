const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../utils/database");

exports.getUserLeaderBoard = async (req, res, next) => {
  try {
    const leaderboardOfUsers = await User.findAll({
      order: [[sequelize.col("totalExpenses"), "DESC"]],
    });

    res.status(200).json({ success: true, leaderboardOfUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
};