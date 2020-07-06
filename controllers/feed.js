const { validationResult } = require("express-validator");
const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalPost;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalPost = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      return res.status(200).json({
        message: "fetched all posts",
        posts: posts,
        totalItems: totalPost,
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(
      "Validation failed, Please enter valid field values"
    );
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
    console.log("[feed.js] new imageURL", imageUrl);
  }
  if (!imageUrl) {
    const error = new Error("Image not found.!");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Couldn't fetch post.!");
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl != post.imageUrl) {
        console.log("[feed.js] clearing old image from DB");
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((post) => {
      return res.status(200).json({ message: "Post updated", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filepath) => {
  const imagePath = path.join(__dirname, "..", filepath);
  fs.unlink(imagePath, (err) => console.log(err));
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found.");
        error.statusCode = 404;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((post) => {
      return res.status(200).json({ message: "Post deleted." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
