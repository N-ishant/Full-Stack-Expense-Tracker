const express = require("express");

const userAuthentication = require("../middleware/auth");
const purchaseController = require("../controllers/purchase");

const router = express.Router();

router.get(
  "/premium-membership",
  userAuthentication.userAuthentication,
  purchaseController.purchasePremium
);

router.post(
  "/update-transactionStatus",
  userAuthentication.userAuthentication,
  purchaseController.updateTransactionStatus
);

module.exports = router;