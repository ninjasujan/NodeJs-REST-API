const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Couldn't authenticate headers");
    error.statusCode = 401;
    throw error;
  }
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    console.log("Jwt failed");
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Couldn't authorize the token");
    error.statusCode = 500;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
