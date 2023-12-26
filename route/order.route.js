"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var order_controller_1 = require("../controller/order.controller");
var orderRouter = express.Router();
orderRouter.post("/create-order", order_controller_1.createOrder);
exports.default = orderRouter;