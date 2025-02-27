const express = require("express");
const multer = require("multer");
const requireAuth = require("../middleware/requireAuth");

const {
  getPosts,
  addPost,
  getPost,
  deletePost,
  likePost,
  explorePosts,
  commentPost,
  deleteComment,
} = require("../controller/postController");
// multer method
const upload = multer({ dest: "../frontend/public/images" });

const router = express.Router();
router.use(requireAuth);

// explore posts
router.get("/explore", explorePosts);

// get all user posts
router.get("/:id", getPosts);

// add post
router.post("/upload/:id", upload.single("picture"), addPost);

// get user post
router.get("/single/:id", getPost);

// delete user post
router.post("/delete/:id", deletePost);

// like post
router.post("/like/:id", likePost);

// comment post
router.post("/comment/:id", commentPost);

// delete comment
router.post("/comment/delete/:id", deleteComment);

module.exports = router;
