const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

likeSchema.set("timestamps", true);

module.exports = mongoose.model("like", likeSchema);
