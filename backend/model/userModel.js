const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
    unique: true,
  },
  picture: {
    type: String,
    required: false,
  },
  followers: {
    type: Number,
    required: false,
  },
  following: {
    type: Number,
    required: false,
  },
  posts: {
    type: Number,
    required: false,
  },
  bio: {
    type: String,
    required: false,
  },
});

// static user signup
userSchema.statics.signup = async function (email, password) {
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email allready in use");
  }

  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is invalid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must contain upper case, lower case, number, and d special vhareacter"
    );
  }

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

// static user login
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Invalid email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Credentials dont match");
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
