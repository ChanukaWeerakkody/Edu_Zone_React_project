"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var cookieParser = require("cookie-parser");
require('dotenv').config();
var express = require("express");
exports.app = express();
var cors = require("cors");
//import cookieParser from "cookie-parser";
//body parser
exports.app.use(express.json({ limit: "50mb" }));
//cookie-parser
exports.app.use(cookieParser());
//cors => cross origin resource sharing
exports.app.use(cors({
    origin: process.env.ORIGIN
}));
//testing api
