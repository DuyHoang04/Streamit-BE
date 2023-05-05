const { seriesModel, movieModel } = require("../models/movieModel");

const mediaController = {
  getAllMovieAndSeries: async (req, res, next) => {
    try {
      const movies = await movieModel.find().populate("genres", "name");
      const series = await seriesModel.find().populate("genres", "name");

      const media = [...movies, ...series];

      res.status(200).json({ success: true, data: media });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = mediaController;
