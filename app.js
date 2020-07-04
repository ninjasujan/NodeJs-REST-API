const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

/* To solve CORS error */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, PUT"
  );
  res.setHeader("Acess-Control-Allow-Headers", "Content-Type, Authorization");
});

const feedRoute = require("./routes/feed");

app.use("/feed", feedRoute);

app.listen(8080, () => {
  console.log("Server running...");
});
