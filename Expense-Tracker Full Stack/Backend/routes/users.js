const express = require("express");

const userController = require("../controllers/users");

const router = express.Router();

router.post("/signup", userController.postSignupData);
router.post("/login", userController.postLoginData);

module.exports = router;