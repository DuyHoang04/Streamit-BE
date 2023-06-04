const { seriesModel, movieModel } = require("../models/movieModel");
const userModel = require("../models/userModel");

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

  saveMovie: async (req, res, next) => {
    try {
      console.log(req.body);
      const { movieId, name, genres, image, isSeries } = req.body;
      const { id } = req.user;

      const dataMovieLike = {
        movieId,
        name,
        genres,
        image,
        isSeries,
      };

      let movieCheck;

      if (isSeries) {
        movieCheck = await seriesModel.findById(movieId);
      } else {
        movieCheck = await movieModel.findById(movieId);
      }

      if (!movieCheck) return res.status(404).json("Movie not found");

      const user = await userModel.findById(id);
      if (user) {
        const { likedMovies } = user;
        const movieAlreadyLike = likedMovies.find(
          (movie) => movie.movieId.toString() === movieId
        );
        console.log("VO");
        console.log(movieAlreadyLike, "MOVIE ");
        if (!movieAlreadyLike) {
          await userModel.findByIdAndUpdate(
            id,
            {
              likedMovies: [...user.likedMovies, dataMovieLike],
            },
            { new: true }
          );
          res.status(200).json({ success: true, message: "Successfully" });
        } else {
          res
            .status(404)
            .json({ success: false, message: "Movie already like" });
        }
      }
    } catch (err) {
      next(err);
    }
  },

  deleteFormSaveMovies: async (req, res, next) => {
    try {
      const { movieId } = req.body;
      const { id } = req.user;
      const user = await userModel.findById(id);
      if (user) {
        const movies = user.likedMovies;
        const movieIndex = movies.findIndex(
          (movie) => movie.movieId === movieId
        );
        if (!movieIndex) {
          res.status(400).json({ success: false, message: "Movie not found" });
        }
        movies.splice(movieIndex, 1);
        await userModel.findByIdAndUpdate(
          id,
          {
            likedMovies: movies,
          },
          { new: true }
        );
        return res.status(200).json({ success: true, message: "Successfully" });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = mediaController;
