const router = require("express").Router();
const genresController = require("../../controllers/genresController");
const { verifyTokenAdmin } = require("../../middlewares/verifyToken");

router.post("/add", genresController.addGenres);
router.put(
  "/update/:genresId",
  verifyTokenAdmin,
  genresController.updateGenres
);
router.get("/", genresController.getAllGenres);

module.exports = router;
