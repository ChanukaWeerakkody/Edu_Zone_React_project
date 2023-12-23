"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourse = exports.uploadCourse = void 0;
var catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
var ErrorHandler_1 = require("../util/ErrorHandler");
var cloudinary = require("cloudinary");
var course_service_1 = require("../services/course.service");
var course_model_1 = require("../models/course.model");
exports.uploadCourse = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, thumbnail, myCloud, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                data = req.body;
                thumbnail = data.thumbnail;
                if (!thumbnail) return [3 /*break*/, 2];
                return [4 /*yield*/, cloudinary.v2.uploader.upload(thumbnail, {
                        folder: "courses"
                    })];
            case 1:
                myCloud = _a.sent();
                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
                _a.label = 2;
            case 2:
                (0, course_service_1.createCourse)(data, res, next);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(err_1.message, 500))];
            case 4: return [2 /*return*/];
        }
    });
}); });
//update course
exports.updateCourse = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data, thumbnail, myCloud, courseId, course, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = req.body;
                thumbnail = data.thumbnail;
                if (!thumbnail) return [3 /*break*/, 3];
                return [4 /*yield*/, cloudinary.v2.uploader.destroy(data.thumbnail.public_id)];
            case 1:
                _a.sent();
                return [4 /*yield*/, cloudinary.v2.uploader.upload(thumbnail, {
                        folder: "courses"
                    })];
            case 2:
                myCloud = _a.sent();
                data.thumbnail = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                };
                _a.label = 3;
            case 3:
                courseId = req.params.id;
                return [4 /*yield*/, course_model_1.default.findByIdAndUpdate(courseId, {
                        $set: data
                    }, { new: true
                    })];
            case 4:
                course = _a.sent();
                res.status(200).json({
                    success: true,
                    course: course
                });
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(err_2.message, 500))];
            case 6: return [2 /*return*/];
        }
    });
}); });