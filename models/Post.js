const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "UserProfile" },
  likes: { type: Number },
  posted: { type: Date, default: new Date() },
  replies: { type: [commentSchema] },
});

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    content: { type: String },
    comments: { type: [commentSchema] },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "UserProfile",
    },
    location: {
      lat: { type: Number },
      long: { type: Number },
      displayLocation: { type: String },
    },
  },
  { timestamps: true }
);

var Post = mongoose.model("Post", postSchema);

module.exports = Post;
