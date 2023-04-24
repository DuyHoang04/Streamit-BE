const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
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

const genresModel = mongoose.model("Genres", genresSchema);

module.exports = genresModel;
