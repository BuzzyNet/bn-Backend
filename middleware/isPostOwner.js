const { Post } = require("../models/models");
const { ObjectId } = require("mongoose").Types;
module.exports = async (req, res, next) => {
  const userPost = await Post.findOne({
    _id: ObjectId(req.body.postId),
    userId: ObjectId(req.user.userId),
  });

  if (userPost) {
    next();
  } else {
    res.status(403).send({ code: 0, message: "post does not belong to user" });
  }
};
