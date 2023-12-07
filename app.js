"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var cookieParser = require("cookie-parser");
require('dotenv').config();
var express = require("express");
exports.app = express();
var user_route_1 = require("./route/user.route");
var cors = require("cors");
var error_1 = require("./middleware/error");
//body parser
exports.app.use(express.json({ limit: "50mb" }));
//cookie-parser
exports.app.use(cookieParser());
//cors => cross origin resource sharing
exports.app.use(cors({
    origin: process.env.ORIGIN
}));
//Routes
exports.app.use('/api/v1', user_route_1.default);
//testing api
exports.app.get("/test", function (req, res, next) {
    res.status(200).json({
        message: "Test route successful",
    });
});
/*
app.post('/api/v1/registration', (req, res) => {
   /!* res.status(200).json({
        message: "Find Route successful",
    });*!/
    app.use("/api/v1", userRouter);
});
*/
//unknown route
exports.app.all("*", function (req, res, next) {
    var err = new Error("Route ".concat(req.originalUrl, " not found"));
    err.statusCode = 404;
    next(err);
});
exports.app.use(error_1.ErrorMiddleware);
