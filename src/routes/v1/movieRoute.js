const router = require("express").Router();
const movieController = require("../../controllers/movieController");
const { verifyToken } = require("../../middlewares/verifyToken");

router.post("/add", movieController.addMovie);
router.put("/update/:movieId", movieController.updateMovie);
router.delete("/delete/:movieId", movieController.deleteMovie);

router.post("/review/:movieId", verifyToken, movieController.addReviewMovie);

router.get("/", movieController.getAllMovies);
router.get("/find/:movieId", movieController.getDetailMovie);

module.exports = router;
