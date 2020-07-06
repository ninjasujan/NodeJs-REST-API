const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.signUp = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const error = new Error("validation failed.!");
    error.data = error.array();
    error.statusCode = 422;
    throw error;
  }
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((user) => {
      return res.status(201).json({
        message: "User registered",
        userId: user._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
