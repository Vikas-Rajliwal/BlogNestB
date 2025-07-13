const { Router } = require("express");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");
const { uploadImage } = require("../utils/cloudinary.js");
const router = Router();
const upload = require("../middlewares/multer.middleware");
const verifyJWT  = require("../middlewares/jwtVerify.js");

// all blogs fetch
router.get("/", async (req, res) => {
  const allBlog = await Blog.find({}).populate("createdBy", "fullName");
  res
    .status(200)
    .json(new ApiResponse(200, allBlog, "All blogs fetched successfully"));
});
// upload blog to the server

router.post(
  "/upload",
  verifyJWT,
  upload.single("coverImageURL"),
  async (req, res) => {
    result = await uploadImage(req.file.path);
    if (!req.file) {
      return res
        .status(400)
        .json(new ApiError(400, "No file uploaded", "File Upload Error"));
    }

    const { tittle, body } = req.body;
    //  const  cleanBody = JSON.parse(body);
    //  const  cleanTittle = JSON.parse(tittle);
    if (!tittle || !body) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Title and body are required", "Validation Error")
        );
    }

    // console.log(cleanBody);
    await Blog.create({
      tittle: tittle,
      body: body,
      coverImageURL: result.secure_url,
      createdBy: req.user._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, Blog, "File uploaded successfully"));
  }
);

// get blog by id
router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  if (!blog) {
    return res.status(404).json(new ApiError(404, "Blog not found"));
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { blog, comments },
        "Blog and comments fetched successfully"
      )
    );
});

module.exports = router;
