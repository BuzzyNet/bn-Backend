const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userFollowersSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "UserProfile" },
  followers: {
    type: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "UserProfile" },
        pending: Boolean,
      },
    ],
  },
});

const followers = mongoose.model("Followers", userFollowersSchema);

module.exports = followers;
