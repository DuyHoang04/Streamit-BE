const router = require("express").Router();
const movieController = require("../../controllers/movieController");
const { verifyToken } = require("../../middlewares/verifyToken");

router.post("/add", movieController.addMovie);
router.put("/review/:movieId", movieController.addReviewMovie);
router.put("/update/:movieId", movieController.updateMovie);
router.delete("/delete/:movieId", movieController.deleteMovie);
router.post("/like/:movieId", verifyToken, movieController.addLikeMovieToUser);

module.exports = router;
