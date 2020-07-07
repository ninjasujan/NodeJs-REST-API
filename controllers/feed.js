const { validationResult } = require("express-validator");
const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const { use } = require("../routes/feed");

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
    creator: req.userId,
  });

  let creator;

  post
    .save()
    .then((postDoc) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      return res.status(201).json({
        message: "Post created successfully.",
        post: post,
        creator: { _id: creator._id, name: creator.name },
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
      if (req.userId.toString() !== post.creator.toString()) {
        const error = new Error("Not authorized.!");
        error.statusCode = 403;
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
      if (req.userId.toString() !== post.creator.toString()) {
        const error = new Error("Not authorized.!");
        error.statusCode = 403;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((post) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      return res.status(200).json({ message: "Post deleted." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getStatus = (req, res, next) => {
  const userId = req.userId;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      return res
        .status(200)
        .json({ message: "Status sent", status: user.status });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateStatus = (req, res, next) => {
  const userId = req.userId;
  const status = req.body.status;
  console.log("[feed.js] status", status);
  User.findOneAndUpdate(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not authorized.");
        error.statusCode = 403;
        throw error;
      }
      user.status = status;
      return user.save();
    })
    .then((result) => {
      return res.status(200).json({
        message: "User status updated.",
        status: result.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      throw err;
    });
};
