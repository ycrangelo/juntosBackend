import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: String,
  username:String,
  thoughts: String,
  picture: String,
  likes: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: String,
    default: 'F'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
