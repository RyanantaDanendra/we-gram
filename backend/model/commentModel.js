const mongoose = require("mongoose");
const User = require("./userModel");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  // userId: {
  //   type: String,
  //   required: true,
  // },
  postId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

commentSchema.set("timeseries", true);

module.exports = mongoose.model("comment", commentSchema);
