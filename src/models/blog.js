const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    tittle: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String, // cloudnary URL 
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);

module.exports = Blog;