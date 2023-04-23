const movieModel = require("../models/movieModel");
const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");

const movieController = {
  addMovie: async (req, res, next) => {
    try {
      const { name, description, language, year, time, genres } = req.body;

      const files = req.files;

      const bannerImage = files.filter(
        (file) => file.fieldname === "bannerImage"
      )[0].url;

      const image = files.filter((file) => file.fieldname === "image")[0].url;
      // const castImages = files
      //   .filter((file) => file.fieldname === "castImage")
      //   .map((file) => file.url);

      // const castImages = req.files.castImage.map((file) => file.filename);

      const movie = new movieModel({
        name,
        description,
        bannerImage,
        image,
        video,
        language,
        year,
        time,
        // casts: casts.map((cast, index) => ({
        //   name: cast.name,
        //   castImage: castImages[index],
        // })),
      });

      for (id of genres) {
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

      // await movie.save();

      console.log(movie);

      res
        .status(200)
        .json({ success: true, message: "Add Movie Successfully" });
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
      const { movieId } = req.params;
      const { name, rating, comment, userId, userImage } = req.body;

      const movie = await movieModel.findById(movieId);

      if (!movie)
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
        return categoryModel.updateMany(
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

  addLikeMovieToUser: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { movieId } = req.params;

      const movieCheck = await movieModel.findById(movieId);

      if (!movieCheck) return res.status(404).json("Movie not found");

      const user = await userModel.findById(id);

      if (user) {
        const { likedMovies } = user;
        const movieAlreadyLike = likedMovies.find(
          (id) => id.toString() === movieId
        );
        if (!movieAlreadyLike) {
          console.log("Vo");
          await userModel.findByIdAndUpdate(
            id,
            {
              likedMovies: [...user.likedMovies, movieId],
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

module.exports = movieController;
