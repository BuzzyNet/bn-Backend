const express = require("express");
const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const { Post } = require("../models/models");
const isPostOwner = require("../middleware/isPostOwner");

const router = express.Router();

router.post("/publish", async (req, res) => {
  const { userId, content, title, lat, long, displayLocation } = req.body;
  const postPayload = new Post({
    userId: ObjectId(userId),
    content,
    title,
    location: { lat, long, displayLocation },
  });

  try {
    const createdPost = await postPayload.save();
    res.send({
      code: 1,
      postId: createdPost._id,
    });
  } catch (err) {
    throw err;
    res.send({ code: 0, message: "could not publish the post" });
  }
});

router.post("/update", isPostOwner, async (req, res) => {
  const { postId } = req.body;
  const properties = [
    "content",
    "title",
    "location.lat",
    "location.long",
    "location.displayLocation",
  ];

  const payLoad = {};
  for (prop in req.body) {
    if (properties.contains(prop)) {
      payLoad[prop] = req.body[prop];
    } else {
      res.send({ code: 0, message: `invalid argument : ${prop}` });
    }
  }
  try {
    await Post.findOneAndUpdate(
      { _id: ObjectId(postId) },
      { $set: payLoad },
      { useFindAndModify: false }
    );
  } catch (err) {
    console.log(err);
    res.send({ code: 0, message: "something went wrong" });
  }
});
router.delete("/delete", isPostOwner, async (req, res) => {
  try {
    await Post.findOneAndUpdate(
      { _id: ObjectId(req.body.postId) },
      { $set: { isDeleted: true } }
    );
    res.send({ code: 1, deleted: true });
  } catch (err) {
    res.send({ code: 0, message: "something went wrong" });
  }
});

router.get("/getUserPosts", isPostOwner, async (req, res) => {
  res.send("to be implemented");
});

module.exports = router;
