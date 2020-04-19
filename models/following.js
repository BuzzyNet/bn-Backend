const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userFollowingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "UserProfile" },
  following: {
    type: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "UserProfile" },
        accepted: Boolean,
      },
    ],
  },
});

const following = mongoose.model("UserFollowing", userFollowingSchema);

module.exports = following;
