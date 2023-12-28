"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var analytics_controller_1 = require("../controller/analytics.controller");
var analyticsRouter = express.Router();
analyticsRouter.get("/get-user-analytic", analytics_controller_1.getUserAnalytics);
analyticsRouter.get("/get-course-analytic", analytics_controller_1.getCourseAnalytics);
analyticsRouter.get("/get-order-analytic", analytics_controller_1.getOrderAnalytics);
exports.default = analyticsRouter;
