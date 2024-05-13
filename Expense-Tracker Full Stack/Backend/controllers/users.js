const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.generateToken = (id, name, ispremiumuser) => {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser },
    process.env.JWT_SECRET_KEY
  );
};

exports.postSignupData = async (req, res, next) => {
  try {
    if (!req.body.username) {
      throw new Error("Name is Mandatory");
    }

    if (!req.body.email) {
      throw new Error("Email is Mandatory");
    }

    if (!req.body.password) {
      throw new Error("Password is Mandatory");
    }

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const saltrounds = 10;

    bcrypt.hash(password, saltrounds, async (err, hash) => {
      if (err) {
        throw new Error("Something went wrong.");
      }

      try {
        const user = await User.create({
          username: username,
          email: email,
          password: hash,
        });

        res
          .status(201)
          .json({ success: true, message: "User created successfully", user });
      } catch (err) {
        // Check if the error is due to duplicate email
        if (err.name === "SequelizeUniqueConstraintError") {
          return res.status(400).json({
            success: false,
            message: "User with this email already exists",
          });
        }

        // Handle other errors
        throw new Error("Something went wrong.");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err });
  }
};

exports.postLoginData = async (req, res, next) => {
  try {
    if (!req.body.email) {
      throw new Error("Email is Mandatory");
    }

    if (!req.body.password) {
      throw new Error("Password is Mandatory");
    }

    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    bcrypt.compare(password, user.dataValues.password, (err, result) => {
      if (err) {
        throw new Error("Something went wrong");
      }

      if (result) {
        return res.status(200).json({
          success: true,
          message: "User logged in successfully",
          token: exports.generateToken(
            user.dataValues.id,
            user.dataValues.username,
            user.dataValues.ispremiumuser
          ),
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Password is incorrect" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err });
  }
};