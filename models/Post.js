const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "UserProfile" },
  comment: { type: String },
  likes: { type: Number, default: 0 },
  posted: { type: Date, default: new Date() },
});

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    title: { type: String },
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
