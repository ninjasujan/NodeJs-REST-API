const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const User = require("../models/User");

const { signUp, login } = require("../controllers/auth");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please add valid mail address")
      .custom((val, { req }) => {
        return User.findOne({ email: val }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already registered.!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 7 }),
    body("name").trim().not().isEmpty(),
  ],
  signUp
);

router.post("/login", login);

module.exports = router;
