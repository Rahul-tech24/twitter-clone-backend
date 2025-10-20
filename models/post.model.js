import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    user: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "User",
       required: true
   },
    text: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
            max: 500,
            required: true
        },
    }],
}, { timestamps: true });


export default mongoose.model("Post", postSchema);