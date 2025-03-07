const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  picture: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
});

postSchema.set("timestamps", true);

module.exports = mongoose.model("Post", postSchema);
