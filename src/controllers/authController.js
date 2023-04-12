const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/Jwt.js");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  register: async (req, res, next) => {
    try {
      console.log(req.body);
      const { username, email, password } = req.body;
      console.log(username, email, password);
      const checkEmail = await userModel.findOne({ email });

      if (checkEmail) {
        return res
          .status(404)
          .json({ success: false, message: "Email already exists" });
      }

      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      await userModel.create({
        username,
        email,
        password: passwordHash,
      });

      return res
        .status(200)
        .json({ success: true, message: "Register Successfully" });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      console.log(req.body);
      const user = await userModel.findOne({ email: req.body.email });
      console.log(user);

      if (!user)
        return res.status(404).json({
          success: false,
          message: "Incorrect Email",
        });
      const passwordCheck = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCheck) {
        return res
          .status(404)
          .json({ success: false, message: "Incorrect Password" });
      }
      const { _id, isAdmin } = user;
      const accessToken = generateAccessToken(_id, isAdmin);

      const refreshToken = generateRefreshToken(_id, isAdmin);
      refreshTokens.push(refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        data: {
          accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      console.log(refreshTokens);

      if (!refreshToken)
        return res
          .status(404)
          .json({ success: false, message: "You are not authenticated" });

      if (!refreshTokens.includes(refreshToken)) {
        return res
          .status(403)
          .json({ success: false, message: "Refresh token is not valid" });
      }

      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
          next(err);
        }
        const { id, isAdmin } = user;
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        // tạo ra access, refresh token mới
        const newAccessToken = generateAccessToken(id, isAdmin);
        const newRefreshToken = generateRefreshToken(id, isAdmin);

        refreshTokens.push(newRefreshToken);
        // lưu refresh token ms vào cookie
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        res.status(200).json({
          success: true,
          data: [
            {
              accessToken: newAccessToken,
            },
          ],
        });
      });
    } catch (err) {
      next(err);
    }
  },

  logOut: async (req, res, next) => {
    try {
      console.log(req.cookies);
      const refreshToken = req.cookies.refreshToken;

      // clear cookie khi logout
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      res.clearCookie("refreshToken");
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully!" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
