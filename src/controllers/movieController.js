const { movieModel } = require("../models/movieModel");
const genresModel = require("../models/genresModel");
const userModel = require("../models/userModel");
const { query } = require("express");

const movieController = {
  addMovie: async (req, res, next) => {
    try {
      const { name, description, language, year, time, genres } = req.body;
      const newGenres = JSON.parse(genres);

      const movieCheck = await movieModel.findOne({ name });

      if (movieCheck) {
        return res
          .status(404)
          .json({ success: false, message: "Movie already exists" });
      }

      const movie = new movieModel({
        name,
        description,
        language,
        year,
        time,
      });
      movie.bannerImage = req.files["bannerImage"][0].path;
      movie.image = req.files["image"][0].path;
      movie.video = req.files["video"][0].path;

      for (id of newGenres) {
        await genresModel
          .findByIdAndUpdate(id, {
            $push: { movies: movie._id },
          })
          .then((genres, err) => {
            if (err)
              res.status(404).json({ success: false, message: err.message });
            movie.genres.push(genres._id);
          });
      }

      await movie
        .save()
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "Add Movie Successfully" });
        })
        .catch(() => {
          res
            .status(500)
            .json({ success: false, message: "Something Went Wrong" });
        });
    } catch (err) {
      next(err);
    }
  },

  updateMovie: async (req, res, next) => {
    try {
      const { movieId } = req.params;
      const { name, description, language, genres, year, time } = req.body;

      const newGenres = JSON.parse(genres);

      const updateData = {
        name,
        description,
        language,
        year,
        time,
        genres: [],
      };

      if (req.files["bannerImage"]) {
        updateData.bannerImage = req.files["bannerImage"][0].path;
      }

      if (req.files["image"]) {
        updateData.image = req.files["image"][0].path;
      }

      if (req.files["video"]) {
        updateData.video = req.files["video"][0].path;
      }

      for (id of newGenres) {
        const existingGenres = await genresModel.findById(id);
        const index = existingGenres.movies.findIndex((movie) =>
          movie.equals(movieId)
        );
        if (index >= 0) {
          existingGenres.movies[index] = movieId;
        } else {
          existingGenres.movies.push(movieId);
        }
        await existingGenres.save();
        updateData.genres.push(id);
      }

      await movieModel
        .findByIdAndUpdate(movieId, updateData, {
          new: true,
        })
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "Update Movie Successfully" });
        });
    } catch (err) {
      next(err);
    }
  },

  addReviewMovie: async (req, res, next) => {
    try {
      const { movieId } = req.params;
      const userId = req.user.id;
      const { name, rating, comment } = req.body;

      const movie = await movieModel.findById(movieId);
      const user = await userModel.findById(userId);

      if (!movie)
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });

      const review = {
        name,
        rating: Number(rating),
        comment,
        user: userId,
        userImage: user?.picturePath,
      };

      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.reduce((acc, user) => acc + user.rating, 0) /
        movie.reviews.length;

      await movie.save();
      res.status(200).json({ success: true, message: "Comment SuccessFully" });
    } catch (err) {
      next(err);
    }
  },

  deleteMovie: async (req, res, next) => {
    try {
      const { movieId } = req.params;

      await movieModel.findByIdAndDelete(movieId).then(() => {
        return genresModel.updateMany(
          {
            movies: movieId,
          },
          {
            $pull: { movies: movieId },
          }
        );
      });

      res
        .status(200)
        .json({ success: true, message: "Delete Movie Successfully" });
    } catch (err) {
      next(err);
    }
  },

  getAllMovies: async (req, res, next) => {
    try {
      const query = {};
      const genresQuery = req.query.genres;

      // Kiểm tra nếu có genresQuery
      if (genresQuery) {
        const genres = await genresModel.findOne({
          name: { $regex: genresQuery, $options: "i" },
        });
        query.genres = genres?._id; // query. phải là feild của movieModel
      }

      let movieList = await movieModel
        .find(query)
        .populate("genres", "name")
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: movieList });
    } catch (err) {
      next(err);
    }
  },

  getDetailMovie: async (req, res, next) => {
    try {
      const { movieId } = req.params;
      const movie = await movieModel
        .findById(movieId)
        .populate("genres", "name");

      res.status(200).json({ success: true, data: movie });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = movieController;
