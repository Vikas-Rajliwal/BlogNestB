const { Router } = require("express");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const mongoose = require("mongoose");
const verifyJWT = require("../middlewares/jwtVerify");
const router = Router();

const savedPost = require("../models/savedSchema.js");

router.get("/mySavedPosts", verifyJWT, async (req, res) => {
  try {
    const userId = req.user._id;

    // console.log("User ID from JWT:", userId); // Should be string or ObjectId

    // ✅ Ensure it's ObjectId before querying
    // const userObjectId = new mongoose.Types.ObjectId(userId);

    // ✅ This will return saved posts for the user
    // const blogId  = "6837f0c28592e42455bc0fd4";
    const savedPosts = await savedPost
      .find({ userId })
      .populate({ path: "blogId" })
      .sort({ createdAt: -1 });

    // console.log("Saved posts:", savedPosts);

    return res.status(200).json({
      success: true,
      data: savedPosts,
      message: "Saved posts retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving saved posts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/:blogId", verifyJWT, async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;
  console.log("blogId", blogId);
  try {
    // Check if the post is already saved
    const existingSavedPost = await savedPost.findOne({ blogId, userId });
    if (existingSavedPost) {
      await existingSavedPost.deleteOne();
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Post unsaved successfully"));
    }

    // Save the post
    await savedPost.create({ blogId, userId });
    return res
      .status(201)
      .json(new ApiResponse(201, null, "Post saved successfully"));
  } catch (error) {
    console.error("Error saving post:", error);
    return res.status(500).json(new ApiError(500, null, "Server Error"));
  }
});

router.get("/:blogId", verifyJWT, async (req, res) => {
  const { blogId } = req.params;
  const userId = req.user._id;

  try {
    const existing = await savedPost.findOne({ blogId, userId });
    res.status(200).json({ isSaved: !!existing });
  } catch (error) {
    console.error("Error checking saved status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
