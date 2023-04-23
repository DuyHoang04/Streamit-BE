require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
const errorHandler = require("./src/middlewares/handleError.js");
const { connectDatabase } = require("./src/configs/database.js");
const routes = require("./src/routes/index.js");
const fileUpload = require("./src/middlewares/fileUpload.js");
const multer = require("multer");
const path = require("path");
const timeout = require("express-timeout-handler");

// const multerCloudinaryMiddleware = require("./src/middlewares/fileUpload.js");

app.use(cors());
app.use(morgan("common"));

// body-parer
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.static("public"));

// cookie
app.use(cookieParser());

app.use(fileUpload); // multer
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//upload file
// app.use(multerCloudinaryMiddleware);

//routes
app.use(routes);

app.all("*", (req, res, next) => {
  const error = new Error("Route not found !!!");
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDatabase();
  console.log(`Server is running on port: ${PORT}`);
});
