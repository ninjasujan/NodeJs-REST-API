const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const feedRoutes = require("./routes/feed");

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Handling api request
app.use("/feed", feedRoutes);

//general error handling middleware
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message;
  return res.status(status).json({
    message: message,
  });
});

mongoose
  .connect("mongodb://localhost:27017/media")
  .then(() => {
    console.log("DATABASE CONNECTION DONE");
    return app.listen(8080);
  })
  .then(() => {
    console.log("SERVER RUNNING");
  })
  .catch((err) => {
    console.log(err);
  });
