const userModel = require("../models/userModel");
const { seriesModel } = require("../models/movieModel");
const genresModel = require("../models/genresModel");

const seriesController = {
  addSeries: async (req, res, next) => {
    try {
      const { name, description, language, year, time, episodes, genres } =
        req.body;
      const newEpisodes = JSON.parse(episodes);
      const newGenres = JSON.parse(genres);

      const seriesMovie = new seriesModel({
        name,
        description,
        language,
        year,
        time,
        genres: [],
        episodes: [],
      });

      seriesMovie.bannerImage = req.files["bannerImage"][0].path;
      seriesMovie.image = req.files["image"][0].path;

      const episodesArray = newEpisodes;
      if (episodesArray && episodesArray.length > 0) {
        for (let i = 0; i < episodesArray.length; i++) {
          const episode = episodesArray[i];
          seriesMovie.episodes.push({
            episodeName: episode.episodeName,
            episodeNumber: episode.episodeNumber,
            video: req.files["video"][i].path,
          });
        }
      }

      for (id of newGenres) {
        await genresModel
          .findByIdAndUpdate(id, {
            $push: { movies: seriesMovie._id },
          })
          .then((genres, err) => {
            if (err)
              res.status(404).json({ success: false, message: err.message });
            seriesMovie.genres.push(genres._id);
          });
      }

      await seriesMovie
        .save()
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "Add Movie Series Successfully" });
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

  updateSeries: async (req, res, next) => {
    try {
      const { seriesId } = req.params;
      const { name, description, language, genres, year, time, episodes } =
        req.body;

      const series = await seriesModel.findById(seriesId);

      const updateDataSeries = {
        name,
        description,
        language,
        year,
        time,
        genres: [],
        episodes: series?.episodes,
      };

      const newGenres = JSON.parse(genres);
      for (id of newGenres) {
        const existingGenres = await genresModel.findById(id);
        const index = existingGenres.movies.findIndex((movie) =>
          movie.equals(seriesId)
        );
        if (index >= 0) {
          existingGenres.movies[index] = seriesId;
        } else {
          existingGenres.movies.push(seriesId);
        }
        await existingGenres.save().then(() => {
          updateDataSeries.genres.push(id);
        });
      }

      if (req.files["bannerImage"]) {
        updateDataSeries.bannerImage = req.files["bannerImage"][0].path;
      }
      if (req.files["image"]) {
        updateDataSeries.image = req.files["image"][0].path;
      }
      if (req.files["video"]) {
        const newEpisodes = JSON.parse(episodes);
        const episodesToUpdate = [];

        if (newEpisodes && newEpisodes.length > 0) {
          for (let i = 0; i < newEpisodes.length; i++) {
            const episode = newEpisodes[i];
            episodesToUpdate.push({
              episodeName: episode?.episodeName,
              episodeNumber: episode?.episodeNumber,
              video: req.files["video"][i].path,
            });
          }
        }
        updateDataSeries.episodes.push(...episodesToUpdate);
      }

      await seriesModel
        .findByIdAndUpdate(
          seriesId,
          {
            $set: updateDataSeries,
          },
          {
            new: true, // trả về movie đã được cập nhật
          }
        )
        .then(() => {
          res
            .status(200)
            .json({ success: true, message: "Update Movie Successfully" });
        })
        .catch(() => {
          res
            .status(500)
            .json({ success: true, message: "Update Movie Failure" });
        });
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

      console.log(seriesId);

      await seriesModel.findByIdAndDelete(seriesId).then(() => {
        return genresModel.updateMany(
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
      const { seriesId } = req.params;
      const { episodeId } = req.query;

      console.log(seriesId, episodeId);
      await seriesModel
        .findByIdAndUpdate(
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

  updateEpisode: async (req, res, next) => {
    const { seriesId } = req.params;
    const { episodeId } = req.query;
    console.log(seriesId, episodeId);
    const { episodeNumber, episodeName } = req.body;
    let video;

    const seriesCheck = await seriesModel.findById(seriesId);

    if (!seriesCheck)
      return res
        .status(404)
        .json({ success: false, message: "Series Not Found" });

    const episodesCheck = seriesCheck.episodes.find(
      (item) => item._id.toString() === episodeId
    );

    if (!episodesCheck)
      return res
        .status(404)
        .json({ success: false, message: "Episodes Not Found" });

    if (req?.files["video"]) {
      video = req.files["video"][0].path;
    }

    const updateEpisode = {
      "episodes.$.episodeName": episodeName,
      "episodes.$.episodeNumber": episodeNumber,
      "episodes.$.video": video,
    };

    await seriesModel
      .findOneAndUpdate(
        { _id: seriesId, "episodes._id": episodeId },
        { $set: updateEpisode },
        { new: true }
      )
      .then(() => {
        res.status(200).json({ success: true, message: "Update Successfully" });
      });
  },

  getAllSeries: async (req, res, next) => {
    const query = {};
    try {
      const genresQuery = req.query.genres;
      if (genresQuery) {
        const genres = await genresModel.findOne({ name: genresQuery });
        query.genres = genres._id;
      }
      const seriesList = await seriesModel
        .find(query)
        .populate("genres", "name")
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, data: seriesList });
    } catch (err) {
      next(err);
    }
  },

  addReviewSeries: async (req, res, next) => {
    try {
      const { seriesId } = req.params;
      const userId = req.user.id;
      const { name, rating, comment } = req.body;

      const series = await seriesModel.findById(seriesId);
      const user = await userModel.findById(userId);

      if (!series)
        return res
          .status(404)
          .json({ success: false, message: "Series not found" });

      const review = {
        name,
        rating: Number(rating),
        comment,
        user: userId,
        userImage: user.picturePath || "",
      };
      series.reviews.push(review);
      series.numReviews = series.reviews.length;
      series.rating =
        series.reviews.reduce((acc, user) => acc + user.rating, 0) /
        series.reviews.length;

      await series.save();
      res.status(200).json({ success: true, message: "Comment SuccessFully" });
    } catch (err) {
      next(err);
    }
  },

  getDetailSeries: async (req, res, next) => {
    try {
      const { seriesId } = req.params;
      const seriesData = await seriesModel
        .findById(seriesId)
        .populate("genres", "name");

      res.status(200).json({ success: true, data: seriesData });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = seriesController;
