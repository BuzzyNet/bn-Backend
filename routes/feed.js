const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { UserProfile, Following, Post } = require("../models/models");
const { ObjectId } = require("mongoose").Types;

router.get("/user_:userId/", async (req, res) => {
  console.log("heyy");
  const userId = ObjectId(req.params.userId);

  let following = await Following.findOne({ userId }, { _id: 0, following: 1 });

  following = following.following
    .filter((user) => user.accepted)
    .map((element) => ObjectId(element.userId));

  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "userprofiles",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $match: { userId: { $in: following } },
    },

    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$userInfo", 0] }, "$$ROOT"],
        },
      },
    },
    {
      $lookup: {
        from: "userprofiles",
        localField: "comments.author",
        foreignField: "_id",
        as: "commentData",
      },
    },
    {
      $project: {
        userName: 1,
        content: 1,
        title: 1,
        comments: 1,
        commentData: 1,
        likes: 1,
      },
    },
  ]);

  posts.forEach((post) => {
    var mergedList = _.map(post.comments, function (item) {
      let obj = _.extend(item, _.find(post.commentData, { _id: item.author }));
      delete obj._id;
    });
    delete post.commentData;
  });

  res.send(posts);
});

module.exports = router;
