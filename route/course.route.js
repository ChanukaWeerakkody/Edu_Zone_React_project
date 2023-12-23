"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var course_controller_1 = require("../controller/course.controller");
var courseRouter = express.Router();
courseRouter.post("/create-course", course_controller_1.uploadCourse);
courseRouter.put("/edit-course/:id", course_controller_1.updateCourse);
exports.default = courseRouter;
