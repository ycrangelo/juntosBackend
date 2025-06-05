import mongoose from "mongoose";

const userSavesSchema = new mongoose.Schema({
  userId: String,
  postId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSaves = mongoose.model("userSaves", userSavesSchema);

export default userSaves;
