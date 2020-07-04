exports.getFeed = (req, res, next) => {
  res.status(200).json({
    posts: [
      { title: "First Post", description: "Clicked when you needed" },
      { title: "Second Post", description: "Clicked in Burming Hamn" },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  // Post saved to DB
  res.status(201).json({
    message: "Post created successfully.",
    post: {
      _id: new Date().toISOString(),
      title: title,
      description: description,
    },
  });
};
