const router = require("express").Router();
const categoryController = require("../../controllers/categoryController");
const { verifyTokenAdmin } = require("../../middlewares/verifyToken");

router.post("/add", verifyTokenAdmin, categoryController.addCategory);
router.put(
  "/update/:categoryId",
  verifyTokenAdmin,
  categoryController.updateCategory
);

module.exports = router;
