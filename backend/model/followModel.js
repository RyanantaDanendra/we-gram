const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const followSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  followedUserId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Follow", followSchema);
