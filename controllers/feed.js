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
