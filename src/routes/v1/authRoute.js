const router = require("express").Router();
const authController = require("../../controllers/authController.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refreshToken", authController.refreshToken);
router.post("/logout", authController.logOut);

module.exports = router;
