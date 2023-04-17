const routes = require("express").Router();
const authRoute = require("./v1/authRoute.js");
const userRoute = require("./v1/userRoute.js");
const movieRoute = require("./v1/movieRoute.js");
const categoryRoute = require("./v1/categoryRoute.js");
const seriesRoute = require("./v1/seriesRoute.js");

routes.use("/api/v1/auth", authRoute);
routes.use("/api/v1/users", userRoute);
routes.use("/api/v1/movies", movieRoute);
routes.use("/api/v1/categories", categoryRoute);
routes.use("/api/v1/series", seriesRoute);

module.exports = routes;
