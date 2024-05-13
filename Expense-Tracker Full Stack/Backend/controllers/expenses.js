const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/database");

exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    console.log(expenses);
    res.status(200).json({ success: true, allExpenses: expenses });
  } catch (err) {
    console.log("Get Expense is failing", JSON.stringify(err));
    res.status(500).json({ success: false, error: err });
  }
};

exports.postAddExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    if (!req.body.amount) {
      throw new Error("Amnount is Mandatory");
    }

    if (!req.body.description) {
      throw new Error("Description is Mandatory");
    }

    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;

    const expenseData = await Expense.create(
      {
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id,
      },
      { transaction: t }
    );

    const totalExpense = Number(req.user.totalExpenses) + Number(amount);
    console.log(totalExpense);
    await User.update(
      { totalExpenses: totalExpense },
      { where: { id: req.user.id }, transaction: t }
    );

    await t.commit();
    res.status(201).json({ success: true, newExpenseData: expenseData });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, error: err });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id;
    if (expenseId == "undefined") {
      console.log("ID is missing");
      return res.status(400).json({ success: false, err: "ID is missing" });
    }

    // Fetch the expense being deleted to get its amount
    const expenseToDelete = await Expense.findOne({
      where: { id: expenseId, userId: req.user.id },
    });

    if (!expenseToDelete) {
      return res.status(404).json({
        success: false,
        message: "Expense does not belong to the user",
      });
    }

    // Get the amount of the expense being deleted
    const expenseAmount = expenseToDelete.amount;

    // Delete the expense
    await Expense.destroy({
      where: { id: expenseId, userId: req.user.id },
      transaction: t,
    });

    // Subtract the expense amount from the user's totalExpenses
    const updatedTotalExpense =
      Number(req.user.totalExpenses) - Number(expenseAmount);

    // Update the user's totalExpenses in the database
    await User.update(
      { totalExpenses: updatedTotalExpense },
      { where: { id: req.user.id }, transaction: t }
    );

    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ success: false, error: err });
  }
};