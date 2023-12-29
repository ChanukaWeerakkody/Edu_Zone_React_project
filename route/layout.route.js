"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var layout_controller_1 = require("../controller/layout.controller");
var layoutRouter = express.Router();
layoutRouter.post("/create-layout", layout_controller_1.createLayout);
layoutRouter.get("/get-layout", layout_controller_1.getLayoutByType);
exports.default = layoutRouter;
