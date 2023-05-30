const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Username is required"],
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    picturePath: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    likedMovies: Array,
    keyReset: String,
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;
