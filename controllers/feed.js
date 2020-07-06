const { validationResult } = require("express-validator");
const Post = require("../models/Post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      return res.status(200).json({
        message: "fetched all posts",
        posts: posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  console.log("[feed.js] controller", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed, Please enter valid field values"
    );
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image added");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\", "/");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: imageUrl,
    creator: {
      name: "Maximilian",
    },
  });

  post
    .save()
    .then((post) => {
      console.log(post);
      return res.status(201).json({
        message: "Post created successfully.",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Couldn't fetch post.!");
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({
        message: "Post fetched successfully",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
