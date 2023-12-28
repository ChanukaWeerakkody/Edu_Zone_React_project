"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var notification_controller_1 = require("../controller/notification.controller");
var notificationRoute = express.Router();
notificationRoute.get("/get-all-notifications", notification_controller_1.getNotifications);
exports.default = notificationRoute;
