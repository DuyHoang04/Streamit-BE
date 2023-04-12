const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: {
    type: String,
  },
  movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
