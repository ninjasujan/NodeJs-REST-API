const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/isAuth");

const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  getStatus,
  updateStatus,
} = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, getPosts);

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
  isAuth,
  createPost
);

router.get("/post/:postId", isAuth, getPost);

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
  isAuth,
  updatePost
);

router.delete("/post/:postId", isAuth, deletePost);

router.get("/status", isAuth, getStatus);

router.put("/status", isAuth, updateStatus);

module.exports = router;
