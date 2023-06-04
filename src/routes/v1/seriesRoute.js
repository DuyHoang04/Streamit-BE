const router = require("express").Router();
const seriesController = require("../../controllers/seriesController");
const { verifyToken } = require("../../middlewares/verifyToken");

router.post("/add", seriesController.addSeries);
// router.put("/review/:movieId", seriesController.addReviewMovie);
router.put("/update-episode/:seriesId", seriesController.updateEpisode);
router.put("/delete-episode/:seriesId", seriesController.deleteEpisodes);
router.put("/update/:seriesId", seriesController.updateSeries);
router.delete("/delete/:seriesId", seriesController.deleteSeries);

router.get("/", seriesController.getAllSeries);

router.post("/review/:seriesId", verifyToken, seriesController.addReviewSeries);

router.get("/find/:seriesId", seriesController.getDetailSeries);

module.exports = router;
