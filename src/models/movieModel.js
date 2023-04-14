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
  },
  {
    timestamps: true,
  }
);

const episodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    episodeNumber: {
      type: Number,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const seriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    language: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    episodes: [episodeSchema],
    rating: {
      type: Number,
      default: 0,
      required: true,
    },
    numReviews: {
      type: Number,
      default: 0,
      required: true,
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const seriesModel = mongoose.model("Series", seriesSchema);
const movieModel = mongoose.model("Movie", MovieSchema);

module.exports = { seriesModel, movieModel };
