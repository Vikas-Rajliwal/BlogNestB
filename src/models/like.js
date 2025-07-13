const { Schema , model } = require("mongoose");
const LikeSchema= new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });
module.exports = model("like", LikeSchema);