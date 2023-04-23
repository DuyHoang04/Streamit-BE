const categoryModel = require("../models/categoryModel");

const categoryController = {
  addCategory: async (req, res, next) => {
    try {
      const { name, description } = req.body;

      const categoryCheck = await categoryModel.findOne({ name });

      if (categoryCheck)
        return res
          .status(404)
          .json({ success: false, message: "Category already exists" });

      await categoryModel.create({
        name,
        description,
      });
      res
        .status(200)
        .json({ success: true, message: "Add Category Successfully" });
    } catch (err) {
      next(err);
    }
  },

  updateCategory: async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const { name, description } = req.body;

      const category = await categoryModel.findByIdAndUpdate(
        categoryId,
        { name, description },
        { new: true, runValidators: true }
      );

      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found!" });
      }

      res
        .status(200)
        .json({ success: true, message: "Update Category Successfully" });
    } catch (err) {
      next(err);
    }
  },

  getAllCategory: async (req, res, next) => {
    try {
      const category = await categoryModel.find();

      res.status(200).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = categoryController;
