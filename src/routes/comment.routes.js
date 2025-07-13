const { Router } = require("express");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const Comment = require("../models/comment");
const router = Router();
const verifyJWT = require("../middlewares/jwtVerify.js");

router.get("/:blogId", async (req, res) => {
  const comments = await Comment.find({ blogId: req.params.blogId })
    .populate("createdBy", "-password -salt")
    .sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(
      200,
      comments,
      "Comments fetched successfully"
    )
  );
});


router.post("/:blogId",verifyJWT, async (req, res) => {
    if (!req.user) {
      return res.status(401).json(
        new ApiError(
          401,
          null,
          "You must be logged in to add a comment"
        )
      );
    }
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.status(201).json(
    new ApiResponse(
      201,
      null,
      "Comment added successfully"
    )
  );
});
module.exports = router;