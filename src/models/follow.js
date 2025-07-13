const { Schema , model } = require("mongoose");
const followersSchema= new Schema({
    authorId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
}, { timestamps: true });
module.exports = model("followers", followersSchema);