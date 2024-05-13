const express = require("express");
const router = express.Router();

const userAuthentication = require("../middleware/auth");
const expensesController = require("../controllers/expenses");

router.get(
  "/get-expenses",
  userAuthentication.userAuthentication,
  expensesController.getAllExpenses
);
router.post(
  "/add-expense",
  userAuthentication.userAuthentication,
  expensesController.postAddExpense
);
router.delete(
  "/delete-expense/:id",
  userAuthentication.userAuthentication,
  expensesController.deleteExpense
);

module.exports = router;