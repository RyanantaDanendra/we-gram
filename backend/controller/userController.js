const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const Follow = require("../model/followModel");
const fs = require("fs");
const path = require("path");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "5d" });
};

// login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // login method from user model
    const user = await User.login(email, password);

    // create auth token
    const token = createToken(user._id);

    // return json response
    res.status(200).json({ user, token });
  } catch (error) {
    // return json response
    res.status(400).json({ error: error.message });
  }
};

// signup
const userSignup = async (req, res) => {
  // take the user input
  const { email, password } = req.body;

  try {
    // signup user from model signup static function
    const user = await User.signup(email, password);

    // create auth token
    const token = createToken(user._id);

    // send json response
    res.status(200).json({ user, token });
  } catch (error) {
    // return error response
    res.status(400).json({ error: error.message });
  }
};

// add username
const addUsername = async (req, res) => {
  const userId = req.params.id;
  const { username } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { username });

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ message: "Username Added", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// add profile image
const addImage = async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.file.filename;

  const userId = req.params.id;

  const newImage = { picture: file };

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: newImage },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// delete profile image
const deleteImage = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById({ _id: userId });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    // stored image path
    const imagePath = path.join(
      __dirname,
      "../../frontend/public/images",
      user.picture
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // set the user profile image to null
    user.picture = null;

    // save the user data
    await user.save();

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// search user
const searchUser = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Field required!" });
  }

  const regex = new RegExp(`^${username}`, "i");
  const foundUser = await User.find({ username: { $regex: regex } })
    .then((users) => {
      if (!users || users.length === 0) {
        return res.json({ error: "No Users Found" });
      }
      return res.status(200).json(users);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

const follow = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).status("Unauthorized");
    }

    const followedUserId = req.params.id;
    if (!followedUserId) {
      return res.status(400).json("User Id Required");
    }

    const findFollow = await Follow.findOne({ userId, followedUserId });
    if (findFollow) {
      const unfollow = await Follow.deleteOne({ userId, followedUserId });
      return res.status(200).json(unfollow);
    }

    const followUser = await Follow.create({ userId, followedUserId });

    return res.status(200).json(followUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const fetchFollowData = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const followedUserId = req.params.id;

    const followData = await Follow.findOne({
      userId: currentUserId,
      followedUserId,
    });

    const totalFollowers = await Follow.find({
      followedUserId,
    }).countDocuments();

    const totalFollowing = await Follow.find({
      userId: followedUserId,
    }).countDocuments();

    const userFollowers = await Follow.find({ followedUserId });
    const userFollowersId = userFollowers.map((follower) => follower.userId);

    const userFollowersData = await User.find({
      _id: { $in: userFollowersId },
    });

    const userFollowing = await Follow.find({ userId: followedUserId });
    const userFollowingId = userFollowing.map(
      (following) => following.followedUserId
    );

    const userFollowingData = await User.find({ _id: userFollowingId });

    return res.status(200).json({
      followData,
      totalFollowers,
      totalFollowing,
      userFollowersData,
      userFollowingData,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  userLogin,
  userSignup,
  addUsername,
  addImage,
  deleteImage,
  searchUser,
  follow,
  fetchFollowData,
};
