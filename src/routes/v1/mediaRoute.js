const router = require("express").Router();
const mediaController = require("../../controllers/mediaController.js");
const { verifyToken } = require("../../middlewares/verifyToken.js");

router.get("/", mediaController.getAllMovieAndSeries);
router.post("/like_movie", verifyToken, mediaController.saveMovie);
router.post(
  "/delete_like_movie/movieId",
  verifyToken,
  mediaController.deleteFormSaveMovies
);

module.exports = router;
