const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const userController = {
  updateUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;

      const picturePath = req.files[0].url;

      const newDataUser = {
        username,
        email,
        picturePath,
      };

      await userModel.findByIdAndUpdate(
        userId,
        {
          $set: newDataUser,
        },
        {
          new: true,
        }
      );
      res.status(200).json({ success: true, message: "Update Successfully" });
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const { oldPassword, newPassword } = req.body;

      const userCheck = await userModel.findById(userId);

      if (!userCheck)
        return res
          .status(404)
          .json({ success: false, message: "Incorrect User" });

      const isMatchPass = await bcrypt.compare(oldPassword, userCheck.password);

      if (!isMatchPass) {
        return res
          .status(404)
          .json({ success: false, message: "Incorrect Password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await userCheck.save();

      res
        .status(200)
        .json({ status: true, msg: "Change password successfully" });
    } catch (err) {
      next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      await userModel.findByIdAndDelete(userId);

      res
        .status(200)
        .json({ success: true, message: "Delete User Successfully" });
    } catch (err) {
      next(err);
    }
  },

  getDetailUser: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const user = await userModel.findByIdAndDelete(userId);

      const { password, ...more } = user._doc;

      res.status(200).json({ success: true, data: { ...more } });
    } catch (err) {
      next(err);
    }
  },
  getAllUser: async (req, res, next) => {
    try {
      const user = await userModel.find({}, "-password -likedMovies");

      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
