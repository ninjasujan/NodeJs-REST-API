const { validationResult } = require("express-validator");

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
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  // Post saved to DB
  res.status(201).json({
    message: "Post created successfully.",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "Maximilian",
      },
      createdAt: new Date(),
    },
  });
};
