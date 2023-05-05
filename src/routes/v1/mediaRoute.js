const router = require("express").Router();
const mediaController = require("../../controllers/mediaController.js");

router.get("/", mediaController.getAllMovieAndSeries);

module.exports = router;
