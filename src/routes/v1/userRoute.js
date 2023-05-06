const router = require("express").Router();
const userController = require("../../controllers/userController.js");
const {
  verifyToken,
  verifyTokenAdmin,
} = require("../../middlewares/verifyToken.js");

router.put("/update/:userId", verifyToken, userController.updateUser);
router.put(
  "/change_password/:userId",
  verifyToken,
  userController.changePassword
);
router.delete("/delete/:userId", verifyTokenAdmin, userController.deleteUser);

router.get("/:userId", userController.getDetailUser);

router.get("/", userController.getAllUser);

module.exports = router;
