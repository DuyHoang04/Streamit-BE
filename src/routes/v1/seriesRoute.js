const router = require("express").Router();
const seriesController = require("../../controllers/seriesController");
const { verifyToken } = require("../../middlewares/verifyToken");

router.post("/add", seriesController.addSeries);
// router.put("/review/:movieId", seriesController.addReviewMovie);
// router.put("/update/:movieId", seriesController.updateMovie);
// router.delete("/delete/:movieId", seriesController.deleteMovie);
// router.post("/like/:movieId", verifyToken, seriesController.addLikeMovieToUser);

module.exports = router;
