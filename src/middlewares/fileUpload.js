const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});
const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "video/webm" ||
    file.mimetype === "video/ogg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
const fileUpload = multer({ storage, fileFilter }).fields([
  { name: "bannerImage", maxCount: 1 },
  { name: "image", maxCount: 10 },
  { name: "video", maxCount: 100 },
  { name: "picturePath", maxCount: 100 },
]);
module.exports = fileUpload;

/* const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: (req, file) => {
      if (file.mimetype.startsWith("image/")) {
        return "image";
      } else if (file.mimetype.startsWith("video/")) {
        return "video";
      } else {
        return "raw";
      }
    },
    format: (req, file) => {
      if (file.mimetype.startsWith("image/")) {
        return "jpg";
      } else if (file.mimetype.startsWith("video/")) {
        return "mp4";
      } else {
        return "raw";
      }
    },

    public_id: (req, file) =>
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname,
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 25 }, // giới hạn kích thước tệp tin
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "video/mp4" || // Thêm định dạng video MP4 vào đây
      file.mimetype === "video/webm" ||
      file.mimetype === "video/ogg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ được phép upload ảnh và video"), false);
    }
  },
}).any();

const multerCloudinaryMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("Error:", err.message);
      return res.status(400).json({ message: err.message, success: false });
    }

    const files = req.files;
    const urls = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files?.length; i++) {
        cloudinary.uploader.upload(files[i].path, (error, result) => {
          if (error) {
            console.log("Error:", error.message);
            return res.status(400).send({ message: error.message });
          }

          // Lưu URL của file đã upload lên Cloudinary
          urls.push({ fieldname: files[i].fieldname, url: result.secure_url });

          // Nếu đã upload xong tất cả các file thì tiếp tục xử lý request
          if (urls.length === files.length) {
            req.files = urls;
            next();
          }
        });
      }
    } else {
      next();
    }
    // Duyệt qua tất cả các file đã upload và upload lên Cloudinary
  });
};

module.exports = multerCloudinaryMiddleware; */
