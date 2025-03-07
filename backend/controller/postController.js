const User = require("../model/userModel");
const Post = require("../model/postModel");
const Like = require("../model/likeModel");
const Comment = require("../model/commentModel");
const Follow = require("../model/followModel");
const fs = require("fs");
const path = require("path");

// get all user posts
const getPosts = async (req, res) => {
  const userId = req.params.id;
  const posts = await Post.find({ userId }).sort({ createdAt: -1 });

  res.status(200).json(posts);
};

// get post
const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const [post, liked, totalLiked, showComment, totalComment] =
      await Promise.all([
        Post.findOne({ _id: postId }),
        Like.find({ userId, postId }),
        Like.countDocuments({ postId }),
        Comment.find({ postId })
          .sort({
            createdAt: -1,
          })
          .populate("user", "username picture"),
        Comment.countDocuments({ postId }),
      ]);

    return res.status(200).json({
      post,
      liked,
      totalLiked,
      showComment,
      totalComment,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// delete post
const deletePost = async (req, res) => {
  try {
    // find post id from params
    const postId = req.params.id;

    // find user
    const userId = res.user._id;

    // variable to unlinkk the post picture
    const findPost = await Post.findOne({ _id: postId });

    // find the userId in Post
    const findUser = await Post.findOne({ userId: userId });

    if (!findPost) {
      res.status(404).json({ message: "Post not found" });
    }

    // cheack if the current user is the uploader
    if (!findUser) {
      return;
    }

    // find image path
    const imagePath = path.join(
      __dirname,
      "../../frontend/public/images",
      findPost.picture
    );

    // unlink the image path
    if (imagePath) {
      fs.unlinkSync(imagePath);
    }

    // delete post data from db
    const post = await Post.deleteOne({ _id: postId });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// add post
const addPost = async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No File Uploaded" });
  }
  const picture = req.file.filename;

  // post caption
  const { caption } = req.body;

  try {
    const userId = req.params.id;
    const post = await Post.create({ picture, caption, userId });

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// like post
const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // const post = await Post.findById(postId);

    const liked = await Like.findOne({ userId, postId });

    if (liked) {
      const dislike = await Like.deleteOne({ _id: liked._id });
      return res.status(200).json({ message: "Like removed" });
    }

    const like = await Like.create({ postId, userId });

    res.status(200).json(like);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// all posts
const explorePosts = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();

    if (totalPosts == 0) {
      return res.status(404).json({ message: "No Post Found" });
    }

    const posts = await Post.aggregate([{ $sample: { size: totalPosts } }]);

    if (!posts) {
      return res.status(404).json({ message: "No Post Found" });
    }
    // console.log(posts);

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// comment
const commentPost = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User not found!" });
    }

    const postId = req.params.id;
    if (!postId) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const { comment } = req.body;

    const commentData = await Comment.create({
      postId,
      comment,
      user: userId,
    });

    return res.status(200).json(commentData);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  const postId = req.params.id;
  const userId = await Post.findOne({ _id: postId }).userId;
  const { commentId } = req.body;

  if (Post.findOne({ _id: postId, userId })) {
    const deleteComment = await Comment.deleteOne({ _id: commentId });
  } else {
    res.status(400).json({ error: "You cant delete this comment!" });
  }

  res.status(200).json({ message: "Comment deleted successfully" });
};

module.exports = {
  getPosts,
  addPost,
  getPost,
  deletePost,
  likePost,
  explorePosts,
  commentPost,
  deleteComment,
};
