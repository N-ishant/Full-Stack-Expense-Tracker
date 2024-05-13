const express = require("express");

const premiumFeaturesController = require("../controllers/premiumFeatures");
const userAuthentication = require("../middleware/auth");

const router = express.Router();

router.get(
  "/showLeaderBoard",
  userAuthentication.userAuthentication,
  premiumFeaturesController.getUserLeaderBoard
);

module.exports = router;