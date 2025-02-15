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
} = require("../controller/postController");
// multer method
const upload = multer({ dest: "../frontend/public/images" });

const router = express.Router();
router.use(requireAuth);

// get all user posts
router.get("/", getPosts);

// explore posts
router.get("/explore", explorePosts);

// add post
router.post("/upload/:id", upload.single("picture"), addPost);

// get user post
router.get("/:id", getPost);

// delete user post
router.post("/delete/:id", deletePost);

// like post
router.post("/like/:id", likePost);

// comment post
router.post("/comment/:id", commentPost);

module.exports = router;
