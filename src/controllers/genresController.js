const genresModel = require("../models/genresModel");
const { movieModel, seriesModel } = require("../models/movieModel");

const genresController = {
  addGenres: async (req, res, next) => {
    try {
      const { name, description } = req.body;

      const genresCheck = await genresModel.findOne({ name });

      if (genresCheck)
        return res
          .status(404)
          .json({ success: false, message: "Genres already exists" });

      await genresModel.create({
        name,
        description,
      });
      res
        .status(200)
        .json({ success: true, message: "Add Genres Successfully" });
    } catch (err) {
      next(err);
    }
  },

  updateGenres: async (req, res, next) => {
    try {
      const { genresId } = req.params;
      const { name, description } = req.body;

      const genresCheck = await genresModel.findOne({ name });
      if (genresCheck)
        return res
          .status(404)
          .json({ success: false, message: "Genres already exists" });

      const genres = await genresModel.findByIdAndUpdate(
        genresId,
        {
          $set: {
            name,
            description,
          },
        },
        { new: true }
      );

      if (!genres) {
        return res
          .status(404)
          .json({ success: false, message: "Genres not found!" });
      }

      res
        .status(200)
        .json({ success: true, message: "Update Genres Successfully" });
    } catch (err) {
      next(err);
    }
  },

  getAllGenres: async (req, res, next) => {
    try {
      const genres = await genresModel.find().sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: genres });
    } catch (err) {
      next(err);
    }
  },
  deleteGenres: async (req, res, next) => {
    try {
      const { genresId } = req.params;
      const genres = await genresModel.findById(genresId);

      if (!genres)
        return res
          .status(404)
          .json({ success: false, message: "Genres not found" });

      await Promise.all([
        movieModel.updateMany(
          {
            genres: genresId,
          },
          {
            $pull: { genres: genresId },
          }
        ),
        seriesModel.updateMany(
          {
            genres: genresId,
          },
          {
            $pull: { genres: genresId },
          }
        ),
      ]);

      await genresModel.findByIdAndDelete(genresId);

      res
        .status(200)
        .json({ success: true, message: "Delete Genres Successfully" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = genresController;
