const { validationResult } = require("express-validator");
const Post = require("../models/Post");

exports.getPosts = (req, res, next) => {
  console.log("feed/posts");
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "Clicked when you needed",
        imageUrl: "images/image1.jpg",
        creator: {
          author: "Maximilian",
        },
        date: new Date().toString(),
      },
      {
        _id: "2",
        title: "Second Post",
        content: "Nature green",
        imageUrl: "images/image2.jpg",
        creator: {
          name: "Maximilian",
        },
        date: new Date().toString(),
      },
    ],
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

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: "images/image1.jpg",
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
