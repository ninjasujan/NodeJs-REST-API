const express = require("express");
const { body } = require("express-validator");

const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Title field must be 5 char long"),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Title field must be 5 char long"),
  ],
  createPost
);

router.get("/post/:postId", getPost);

router.put(
  "/post/:postId",
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Title field must be 5 char long"),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Title field must be 5 char long"),
  ],
  updatePost
);

router.delete("/feed/post/:postId", deletePost);

module.exports = router;
