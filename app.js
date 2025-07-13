require("dotenv").config();
const path = require("path");
const express = require("express");
const cookiePaser = require("cookie-parser");
const cors = require("cors");
const Blog = require("./src/models/blog");
const User = require("./src/models/user");
const ApiResponse = require("./src/utils/apiResponse");
const userRoute = require("./src/routes/user.routes");
const ApiError = require("./src/utils/apiError");
const blogRoute = require("./src/routes/blog.routes");
const commentRoute = require("./src/routes/comment.routes");
const likeRoute = require("./src/routes/like.routes");
const savedCollectionRoute = require("./src/routes/savedPost.routes");
const followRoute = require("./src/routes/follow.routes");
// const userRoute = require("./src/routes/user");
const {
  checkForAuthenticationCookie,
} = require("./src/middlewares/authentication");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use(express.json());


// acceses to frontend 
app.use(cors({
  origin: ['http://localhost:5173'], // 👈 replace with the site you want to allow
  credentials: true,
}));

// users routers
app.use("/api/v1/user",userRoute);
// blogs routers
app.use("/api/v1/blog", blogRoute);
// comment routers
app.use("/api/v1/comment", commentRoute);
// like routers
app.use("/api/v1/like", likeRoute);
// followers
app.use("/api/v1/follow", followRoute);

// saved collection
app.use("/api/v1/save", savedCollectionRoute);


app.get("/user", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      users: users,
    });
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong",
      error: err.message,
    });
  }
});

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return  res.status(200).json(
    new ApiResponse(
      200,
      allBlogs,
      "All blogs fetched successfully"
    )
  );
  
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

 module.exports = app;