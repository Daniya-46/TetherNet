const mongoose = require("mongoose");
const Post = require("../models/postModel");

//GET feed
const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username profilePic isPrivate")
      .populate({
        path: "comments.author",
        select: "username",
      });

    const filteredPosts = posts.filter((post) => {
      if (post.author.isPrivate && post.author._id !== req.user._id) {
        return false;
      }
      return true;
    });

    res.status(200).json(filteredPosts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//GET 1 post
const getSinglePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "This post doesn't exist" });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
};

//POST a new post
const newPost = async (req, res) => {
  const { caption } = req.body;
  const mediaUrl = req.file ? `/uploads/posts/${req.file.filename}` : "";

  try {
    const author = req.user._id;
    const post = await Post.create({
      author,
      caption,
      mediaUrl,
      likes: {},
      comments: [],
    });

    const populatedPost = await post.populate("author", "username profilePic");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//DELETE a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "This post doesn't exist" });
  }

  const post = await Post.findByIdAndDelete({ _id: id });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
};

//LIKE a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const post = await Post.findById(id);
    if (!post.likes) {
      post.likes = new Map();
    }

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    post.likes = post.likes;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//COMMENT on post
const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body._id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      author: userId,
      content: content,
    };

    post.comments.push(newComment);
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getFeed,
  newPost,
  getSinglePost,
  deletePost,
  likePost,
  commentOnPost,
};
