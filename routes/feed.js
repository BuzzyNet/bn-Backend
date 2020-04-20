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

  let posts = await Post.aggregate([
    {
      $lookup: {
        from: "userprofiles",
        localField: "userId",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $match: { userId: { $in: following }, isDeleted: false },
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
    {
      $addFields: {
        likesCount: {
          $cond: {
            if: { $isArray: "$likes" },
            then: { $size: "$likes" },
            else: 0,
          },
        },
      },
    },
  ]);

  posts.forEach((post) => {
    var mergedList = _.map(post.comments, function (item) {
      let obj = _.extend(item, _.find(post.commentData, { _id: item.author }));
      delete obj._id;
      return obj;
    });
    post.comments = mergedList;
    delete post.commentData;
  });

  res.send(posts);
});

router.get("/Likes", async (req, res) => {
  const { postId } = req.query;
  likes = await Post.aggregate([
    { $match: { _id: ObjectId(postId), isDeleted: false } },
    {
      $lookup: {
        from: "userprofiles",
        localField: "likes",
        foreignField: "_id",
        as: "likes",
      },
    },
    { $project: { likes: 1 } },
  ]);
  if (likes.length == 0) {
    res.send({ code: 0, message: "post Does not exist" });
  } else {
    res.send(likes);
  }
});

router.post("/likes", async (req, res) => {
  const { postId, userId } = req.body;
  try {
    const updatedDocument = await Post.findOneAndUpdate(
      { _id: ObjectId(postId) },
      { $addToSet: { likes: ObjectId(userId) } },
      { projection: { likes: 1 }, useFindAndModify: false }
    );
    console.log(updatedDocument);
    res.send({ code: 1, numLikes: updatedDocument.likes.length });
  } catch (e) {
    // throw e;
    res.send({ code: 0 });
  }
});
router.get("/comments", async (req, res) => {
  const { postId, skip, limit } = req.query;
  let comments = await Post.aggregate([
    { $match: { _id: ObjectId(postId), isDeleted: false } },
    { $project: { comments: 1, _id: 1 } },
    {
      $lookup: {
        from: "userprofiles",
        localField: "comments.author",
        foreignField: "_id",
        as: "commentData",
      },
    },
  ]);

  comments = _.map(comments[0].comments, function (item) {
    let obj = _.extend(
      item,
      _.find(comments[0].commentData, { _id: item.author })
    );
    delete obj._id;
    return obj;
  });

  //naive solution.. figure out how to paginate in the aggregation pipeline
  if (skip && limit) comments = comments.slice(skip, skip + limit);

  res.send(comments);
});

router.post("/comments", async (req, res) => {
  const { userId, comment, postId } = req.body;

  const commentObject = { userId: ObjectId(userId), comment };

  try {
    await Post.findOneAndUpdate(
      { _id: ObjectId(postId), isDeleted: false },
      { $push: { comments: commentObject } },
      { projection: { likes: 1 }, useFindAndModify: false }
    );
    res.send({ code: 1, message: "comment posted successfully" });
  } catch (err) {
    res.send({ code: 0, message: "error occured" });
  }
});

module.exports = router;
