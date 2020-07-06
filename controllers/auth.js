const { validationResult } = require("express-validator");
const User = require("../models/User");

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
};
