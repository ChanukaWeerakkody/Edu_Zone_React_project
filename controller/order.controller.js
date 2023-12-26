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
exports.createOrder = void 0;
var path = require("path");
var catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
var ErrorHandler_1 = require("../util/ErrorHandler");
var course_model_1 = require("../models/course.model");
var ejs = require("ejs");
var sendMail_1 = require("../util/sendMail");
var notificationModel_1 = require("../models/notificationModel");
var user_model_1 = require("../models/user.model");
var order_service_1 = require("../services/order.service");
//create order
exports.createOrder = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, courseId_1, payment_info, user, courseExistInUser, course, data, mailData, html, err_1, notification, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 11, , 12]);
                _a = req.body, courseId_1 = _a.courseId, payment_info = _a.payment_info;
                return [4 /*yield*/, user_model_1.default.findById('65717e56cb7f7d716169bbea')];
            case 1:
                user = _b.sent();
                courseExistInUser = user === null || user === void 0 ? void 0 : user.courses.some(function (course) { return course._id.toString() === courseId_1; });
                if (courseExistInUser) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("You have already purchased this course", 400))];
                }
                return [4 /*yield*/, course_model_1.default.findById(courseId_1)];
            case 2:
                course = _b.sent();
                if (!course) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Course not found", 404))];
                }
                data = {
                    courseId: courseId_1,
                    userId: user === null || user === void 0 ? void 0 : user._id,
                    payment_info: payment_info
                };
                mailData = {
                    order: {
                        _id: course._id.toString().slice(0, 6),
                        name: course.name,
                        price: course.price,
                        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    }
                };
                html = ejs.renderFile(path.join(__dirname, '../mails/order-confirmation.ejs'), { order: mailData });
                _b.label = 3;
            case 3:
                _b.trys.push([3, 6, , 7]);
                if (!user) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, sendMail_1.default)({
                        email: user.email,
                        subject: "Order Confirmation",
                        template: "order-confirmation.ejs",
                        data: mailData
                    })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(err_1.message, 500))];
            case 7:
                user === null || user === void 0 ? void 0 : user.courses.push(course === null || course === void 0 ? void 0 : course._id);
                return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.save())];
            case 8:
                _b.sent();
                return [4 /*yield*/, notificationModel_1.default.create({
                        userId: user === null || user === void 0 ? void 0 : user._id,
                        title: "New Order",
                        message: "You have a new order from ".concat(course === null || course === void 0 ? void 0 : course.name, " course")
                    })];
            case 9:
                notification = _b.sent();
                if (notification) {
                    course.purchased += 1;
                }
                return [4 /*yield*/, course.save()];
            case 10:
                _b.sent();
                (0, order_service_1.newOrder)(data, res, next);
                return [3 /*break*/, 12];
            case 11:
                err_2 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(err_2.message, 500))];
            case 12: return [2 /*return*/];
        }
    });
}); });
