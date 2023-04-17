const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");
const { seriesModel } = require("../models/movieModel");

const seriesController = {
  addMovie: async (req, res, next) => {
    try {
      const { name, description, language, year, time, category, episodes } =
        req.body;

      const seriesMovie = new seriesModel({
        name,
        description,
        language,
        year,
        time,
      });

      seriesMovie.bannerImage = req.files["bannerImage"][0].path;
      seriesMovie.image = req.files["image"][0].path;

      const episodesArray = episodes;
      if (episodesArray && episodesArray.length > 0) {
        for (let i = 0; i < episodesArray.length; i++) {
          const episode = episodesArray[i];
          seriesMovie.episodes.push({
            name: episode.name,
            episodes: episode.episodeNumber,
            video: req.files["video"][i].path,
          });
        }
      }

      for (id of category) {
        await categoryModel
          .findByIdAndUpdate(id, {
            $push: { movies: id },
          })
          .then((category, err) => {
            if (err)
              res.status(404).json({ success: false, message: err.message });
            movie.category.push(category._id);
          });
      }

      await seriesMovie.save();

      res
        .status(200)
        .json({ success: true, message: "Add Movie Series Successfully" });
    } catch (err) {
      next(err);
    }
  },

  updateMovie: async (req, res, next) => {
    try {
      const { movieId } = req.params;
      const { name, description, language, category, year, time, video } =
        req.body;

      const files = req.files;

      const bannerImage = files?.filter(
        (file) => file.fieldname === "bannerImage"
      )[0].url;

      const image = files?.filter((file) => file.fieldname === "image")[0].url;

      const updateData = {
        name,
        description,
        bannerImage,
        image,
        video,
        language,
        year,
        time,
        category: [],
      };

      for (id of category) {
        const existingCategory = await categoryModel.findById(id);

        const index = existingCategory.movies.findIndex((movie) =>
          movie.equals(movieId)
        );
        if (index >= 0) {
          existingCategory.movies[index] = movieId;
        } else {
          existingCategory.movies.push(movieId);
        }
        await existingCategory.save();
        updateData.category.push(id);
      }

      await movieModel.findByIdAndUpdate(movieId, updateData, {
        new: true, // trả về movie đã được cập nhật
      });

      res
        .status(200)
        .json({ success: true, message: "Update Movie Successfully" });
    } catch (err) {
      next(err);
    }
  },

  addReviewMovie: async (req, res, next) => {
    try {
      const { seriesId } = req.params;
      const { name, rating, comment, userId, userImage } = req.body;

      const series = await seriesModel.findById(seriesId);

      if (!series)
        return res
          .status(404)
          .json({ success: false, message: "Movie not found" });

      const review = {
        name,
        rating: Number(rating),
        comment,
        user: userId,
        userImage,
      };

      series.reviews.push(review);
      series.numReviews = movie.reviews.length;
      series.rating =
        series.reviews.reduce((acc, user) => acc + user.rating, 0) /
        series.reviews.length;

      await series.save();
      res.status(200).json({ success: true, message: "Comment SuccessFully" });
    } catch (err) {
      next(err);
    }
  },

  deleteSeries: async (req, res, next) => {
    try {
      const { seriesId } = req.params;

      await seriesModel.findByIdAndDelete(seriesId).then(() => {
        return categoryModel.updateMany(
          {
            movies: seriesId,
          },
          {
            $pull: { movies: seriesId },
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

  deleteEpisodes: async (req, res, next) => {
    try {
      const { seriesId, episodeId } = req.query;

      await seriesModel
        .findByIdAndDelete(
          seriesId,
          {
            $pull: { episodes: { _id: episodeId } },
          },
          {
            new: true,
          }
        )
        .then((result, err) => {
          if (err) {
            return res
              .status(404)
              .json({ success: false, message: "Can't not delete episode" });
          } else {
            res
              .status(200)
              .json({ success: true, message: "Delete episode Successfully" });
          }
        });
    } catch (err) {
      next(err);
    }
  },

  addLikeMovieToUser: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { seriesId } = req.params;

      const seriesCheck = await seriesModel.findById(seriesId);

      if (!seriesCheck) return res.status(404).json("Movie not found");

      const user = await userModel.findById(id);

      if (user) {
        const { likedMovies } = user;
        const movieAlreadyLike = likedMovies.find(
          (id) => id.toString() === seriesId
        );
        if (!movieAlreadyLike) {
          await userModel.findByIdAndUpdate(
            id,
            {
              likedMovies: [...user.likedMovies, seriesId],
            },
            {
              new: true,
            }
          );
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Movie already like" });
        }
      }

      res.status(200).json({ success: true, message: "Successfully" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = seriesController;
