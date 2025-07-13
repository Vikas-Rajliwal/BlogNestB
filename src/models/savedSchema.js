// SavedPost model (models/SavedPost.js)
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const savedSchema = new Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "blog", // ✅ Make sure "blog" is your actual model name
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user", // ✅ Make sure "user" is your actual model name
      required: true,
    },
  },
  { timestamps: true }
);

const SavedPost = model("SavedPost", savedSchema); // ✅ Capitalize model name
module.exports = SavedPost;
