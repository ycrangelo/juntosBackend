import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: String,
  username: String,
  profile:String,
  postId: String,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const comments = mongoose.model("comments", commentSchema);

export default comments;
