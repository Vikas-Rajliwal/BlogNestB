const { Router } = require("express");
const ApiResponse = require("../utils/apiResponse");
const auth = require("../middlewares/authentication");
const ApiError = require("../utils/apiError");
const Like = require("../models/like");
const router = Router();
const verifyJWT = require("../middlewares/jwtVerify.js");
const Blog = require("../models/blog.js");
router.post("/:blogId", verifyJWT ,async (req, res) => {
    try {
        const blogId = req.params.blogId;

        // Step 1: Get the blog
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json(new ApiError(404, null, "Blog not found"));
        }

        // Step 2: Extract the userId from blog
        const userId = req.user._id;

        // Step 3: Check if like already exists
        const existingLike = await Like.findOne({ blogId, userId });

        if (existingLike) {
            await Like.findOneAndDelete({ blogId, userId });
            const likeCount = await Like.countDocuments({ blogId });
            return res.status(202).json(
                new ApiResponse(202, { likeCount }, "Post unliked")
            );
        }

        // Step 4: Create like
        await Like.create({ blogId, userId });

        const likeCount = await Like.countDocuments({ blogId });
        return res.status(201).json(
            new ApiResponse(201, { likeCount }, "Post liked successfully")
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json(new ApiError(500, null, "Server Error"));
    }
});

router.get("/:blogId", async (req, res) => {
    const likeCount = await Like.countDocuments({ blogId: req.params.blogId });
    return res.status(200).json(
        new ApiResponse(
            200,
            { likeCount },
            "Like count fetched successfully"
        )
    );
});
module.exports = router;