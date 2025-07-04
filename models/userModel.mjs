import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  fullname: String,
  gender: String,
  contactNumber: String,
  profile:String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});


const User = mongoose.model("User", userSchema);

export default User;
