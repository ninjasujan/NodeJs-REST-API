const express = require("express");
const router = express.Router();

const { getFeed, createPost } = require("../controllers/feed");

router.get("/posts", getFeed);
router.post("/post", createPost);

module.exports = router;
