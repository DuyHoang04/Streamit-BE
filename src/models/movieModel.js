const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    rating: {
      type: Number,
      require: true,
      default: 0,
    },
    comment: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    userImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const MovieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    description: {
      type: String,
    },
    bannerImage: {
      type: String,
      require: [true, "Title is required"],
    },
    image: {
      type: String,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    language: {
      type: String,
    },
    year: {
      type: String,
    },
    time: {
      type: String,
    },
    video: {
      type: String,
    },
    rating: {
      type: String,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    casts: [
      {
        name: { type: String },
        castImage: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const movieModel = mongoose.model("Movie", MovieSchema);

module.exports = movieModel;
