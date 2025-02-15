const express = require("express");
const multer = require("multer");
const requireAuth = require("../middleware/requireAuth");
const {
  userLogin,
  userSignup,
  addUsername,
  addImage,
  deleteImage,
} = require("../controller/userController");
// const authenticateToken = require("../middleware/authenticateToken");
const upload = multer({ dest: "../frontend/public/images" });

const router = express.Router();
// router.use(authenticateToken);

router.post("/login", userLogin);

router.post("/signup", userSignup);

// add username
router.post("/add/username/:id", addUsername).use(requireAuth);

// upload picture
router
  .post("/add/image/:id", upload.single("picture"), addImage)
  .use(requireAuth);

// delete picture
router.post("/delete/image/:id", deleteImage).use(requireAuth);

module.exports = router;
