const {
  generateAccessToken,
  generateRefreshToken,
  generateTokenResetPass,
} = require("../middlewares/Jwt.js");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../util/mailConfig.js");

let refreshTokens = [];

const authController = {
  register: async (req, res, next) => {
    try {
      console.log(req.body);
      const { username, email, password } = req.body;
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
      const user = await userModel.findOne({ email: req.body.email });

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
        domain: false,
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.cookie("accessToken", accessToken, {
        domain: false,
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        data: {
          isAdmin,
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

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      let user = await userModel.findOne({ email });

      if (!user)
        return res.status(404).json({
          success: false,
          message: "User with this email does not exist.",
        });

      const { _id, isAdmin } = user;
      const tokenReset = generateTokenResetPass(_id, isAdmin);

      // random key reset
      var keyReset = "";
      for (var i = 0; i < 6; i++) {
        var randomNumber = Math.floor(Math.random() * 10);
        keyReset += randomNumber.toString();
      }

      let mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Password Reset",
        html: ` 
           <h2> KEY RESET PASSWORD FOR YOU: </h2>
           <h1>${keyReset}</h1> 
    `,
      };

      await userModel
        .findByIdAndUpdate(
          user._id,
          {
            $set: { keyReset: keyReset },
          },
          { new: true }
        )
        .then((result) => {
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(400).json({
                success: true,
                message: "Send email failed",
              });
            } else {
              return res.status(200).json({
                success: true,
                message: "Email have been sent, kindly follow the instructions",
              });
            }
          });
        })
        .catch((err) => {
          return res.status(200).json({
            success: true,
            message: "Error",
          });
        });
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { keyReset, newPass } = req.body;

      if (keyReset) {
        const user = await userModel.findOne({ keyReset });

        if (!user) {
          return res
            .status(400)
            .json({ error: "User with this token does not exist." });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPass, salt);

        const newPassword = {
          password: passwordHash,
          keyReset: "", // after updating the password in db make reset lik empty
        };

        await userModel
          .findByIdAndUpdate(user._id, newPassword, { new: true })
          .then((result) => {
            return res.status(200).json({
              success: true,
              message: "Your password has been changed",
            });
          });
      } else {
        res
          .status(404)
          .json({ success: false, message: "You are not authenticate" });
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
