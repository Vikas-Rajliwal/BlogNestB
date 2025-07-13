const { Router } = require("express");
const User = require("../models/user");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const router = Router();
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const blog = require("../models/blog");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const verifyJWT = require("../middlewares/jwtVerify");
const ObjectId = mongoose.Types.ObjectId;

// const authMiddleware = require("../middlewares/authMiddleware");

// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     res.json({ success: true, user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email and password, generate JWT token
    const { token, user } = await User.matchPasswordAndGenerateToken(email, password);

    console.log("userid", user._id);

    // Optional: Fetch more complete user details (if needed)
    const userDetail = await User.findById(user._id).select("-password");
 console.log("User detail fetched:", userDetail);
    // Set cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    });

    // Return success with user detail
    return res.status(200).json({
      success: true,
      user: userDetail,
      message: "Signin successful",
    });

  } catch (error) {
    console.error("Signin error:", error);
    return res.status(400).json({
      success: false,
      error: "Invalid email or password",
    });
  }
});



router.get("/logout", (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

router.get("/myprofile",verifyJWT, async (req, res) => {
  const userId = req.user._id;
  console.log("Fetching profile for user ID:", userId);
  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User ID is required"));
  }
  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User not found"));
  }
  console.log("User profile fetched:", user);
  const blogs = await blog.find({ createdBy: userId });
  return res.status(200).json(new ApiResponse(200, { user, blogs }, "Profile fetched successfully"));
});


router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching user with ID:", userId);
  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User ID is required"));
  }
  const user = await User.findById(userId);
  // const user = blog.createdBy;

  // if (!user) {
  //   return res
  //     .status(404)
  //     .json(new ApiResponse(404, null, "User not found"));
  // }
  // console.log("Looking  by user:", user);
   const relatedBlogs = await blog.find({
      createdBy: userId,
      
    });
console.log("Related blogs for user:", userId);
  console.log("Blogs found:", relatedBlogs.length);
  console.log("Blogs found:", relatedBlogs);
  return res.status(200).json(new ApiResponse(200, {user, relatedBlogs}, "User fetched successfully"));
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }
  const existUser = await User.findOne({ email: email });
  if (existUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User already exists with this email"));
  }
  await User.create({
    fullName,
    email,
    password,
  });
  return res
    .status(201)
    .json(
      new ApiResponse(201, null, "User created successfully, please sign in")
    );
});

module.exports = router;
