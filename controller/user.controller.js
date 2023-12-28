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
exports.deleteUser = exports.getAllUsers = exports.updateUserInfo = exports.socialAuth = exports.getUserInfo = exports.updateAccessToken = exports.logoutUser = exports.loginUser = exports.activateUser = exports.createActivationToken = exports.registerUser = void 0;
var path = require("path");
require('dotenv').config();
var ErrorHandler_1 = require("../util/ErrorHandler");
var catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
var user_model_1 = require("../models/user.model");
var jwt = require("jsonwebtoken");
var ejs = require("ejs");
var sendMail_1 = require("../util/sendMail");
var jwt_1 = require("../util/jwt");
var redis_1 = require("../util/redis");
var user_service_1 = require("../services/user.service");
exports.registerUser = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, isEmailExist, user, activationToken, activationCode, data, html, error_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                isEmailExist = _b.sent();
                if (isEmailExist) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Email already exists", 400))];
                }
                user = {
                    name: name_1,
                    email: email,
                    password: password,
                };
                activationToken = (0, exports.createActivationToken)(user);
                activationCode = activationToken.activationCode;
                data = { user: { name: user.name }, activationCode: activationCode };
                html = ejs.renderFile(path.join(__dirname, "../mails/activation-mail.ejs"), data);
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, sendMail_1.default)({
                        email: user.email,
                        subject: "Activate your account",
                        template: "activation-mail.ejs",
                        data: data,
                    })];
            case 3:
                _b.sent();
                res.status(200).json({
                    success: true,
                    message: "Account created successfully, please check ".concat(user.email, " to activate your account"),
                    activationToken: activationToken.token,
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_1.message, 500))];
            case 5: return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_2.message, 500))];
            case 7: return [2 /*return*/];
        }
    });
}); });
var createActivationToken = function (user) {
    var activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    var token = jwt.sign({
        user: user,
        activationCode: activationCode
    }, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    });
    return { token: token, activationCode: activationCode };
};
exports.createActivationToken = createActivationToken;
exports.activateUser = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, activation_token, activation_Code, newUser, _b, name_2, email, password, existUser, user, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, activation_token = _a.activation_token, activation_Code = _a.activation_Code;
                newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
                if (newUser.activationCode !== activation_Code) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid activation code", 400))];
                }
                _b = newUser.user, name_2 = _b.name, email = _b.email, password = _b.password;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                existUser = _c.sent();
                if (existUser) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("User already exists", 400))];
                }
                return [4 /*yield*/, user_model_1.default.create({
                        name: name_2,
                        email: email,
                        password: password
                    })];
            case 2:
                user = _c.sent();
                res.status(200).json({
                    success: true,
                    message: "Account activated successfully",
                    user: user
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _c.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_3.message, 500))];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.loginUser = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordMatched, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Please enter email and password", 400))];
                }
                return [4 /*yield*/, user_model_1.default.findOne({ email: email }).select("+password")];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid email or password", 400))];
                }
                return [4 /*yield*/, user.comparePassword(password)];
            case 2:
                isPasswordMatched = _b.sent();
                if (!isPasswordMatched) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Invalid email or password", 400))];
                }
                (0, jwt_1.sendToken)(user, 200, res);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_4.message, 500))];
            case 4: return [2 /*return*/];
        }
    });
}); });
//Logout user
exports.logoutUser = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    var _a;
    return __generator(this, function (_b) {
        try {
            res.cookie("access_token", "", { maxAge: 1 });
            res.cookie("refresh_token", "", { maxAge: 1 });
            userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "";
            redis_1.redis.del(userId);
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 500))];
        }
        return [2 /*return*/];
    });
}); });
//update access token
exports.updateAccessToken = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refresh_token, decoded, message, session, user, accessToken, refreshToken, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                refresh_token = req.cookies.refresh_token;
                decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
                message = "Could not refresh token";
                if (!decoded) {
                    return [2 /*return*/, next(new ErrorHandler_1.default(message, 401))];
                }
                return [4 /*yield*/, redis_1.redis.get(decoded.id)];
            case 1:
                session = _a.sent();
                if (!session) {
                    return [2 /*return*/, next(new ErrorHandler_1.default(message, 401))];
                }
                user = JSON.parse(session);
                accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
                    expiresIn: "5m"
                });
                refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
                    expiresIn: "3d"
                });
                req.user = user;
                res.cookie("access_token", accessToken, jwt_1.accessTokenOptions);
                res.cookie("refresh_token", refreshToken, jwt_1.refreshTokenOptions);
                res.status(200).json({
                    success: true,
                    accessToken: accessToken
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_5.message, 500))];
            case 3: return [2 /*return*/];
        }
    });
}); });
//get user info
exports.getUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    var _a;
    return __generator(this, function (_b) {
        try {
            userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            (0, user_service_1.getUserById)(userId, res);
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 500))];
        }
        return [2 /*return*/];
    });
}); });
//social auth
exports.socialAuth = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name_3, avatar, user, newUser, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, name_3 = _a.name, avatar = _a.avatar;
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, user_model_1.default.create({ name: name_3, email: email, avatar: avatar })];
            case 2:
                newUser = _b.sent();
                (0, jwt_1.sendToken)(newUser, 200, res);
                return [3 /*break*/, 4];
            case 3:
                (0, jwt_1.sendToken)(user, 200, res);
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_6 = _b.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_6.message, 500))];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports.updateUserInfo = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, name_4, email, user, isEmailExist, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
                _a = req.body, name_4 = _a.name, email = _a.email;
                return [4 /*yield*/, user_model_1.default.findById(userId)];
            case 1:
                user = _c.sent();
                if (!(email && user)) return [3 /*break*/, 3];
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 2:
                isEmailExist = _c.sent();
                if (isEmailExist) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("Email already exists", 400))];
                }
                user.email = email;
                _c.label = 3;
            case 3:
                if (name_4 && user) {
                    user.name = name_4;
                }
                return [4 /*yield*/, (user === null || user === void 0 ? void 0 : user.save())];
            case 4:
                _c.sent();
                return [4 /*yield*/, redis_1.redis.set(userId, JSON.stringify(user))];
            case 5:
                _c.sent();
                res.status(201).json({
                    success: true,
                    user: user
                });
                return [3 /*break*/, 7];
            case 6:
                error_7 = _c.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_7.message, 500))];
            case 7: return [2 /*return*/];
        }
    });
}); });
//get all users ->only for admin
exports.getAllUsers = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            (0, user_service_1.getAllUserService)(res);
        }
        catch (error) {
            return [2 /*return*/, next(new ErrorHandler_1.default(error.message, 500))];
        }
        return [2 /*return*/];
    });
}); });
//delete user ->only for admin
exports.deleteUser = (0, catchAsyncErrors_1.CatchAsyncError)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, user_model_1.default.findById(id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, next(new ErrorHandler_1.default("User not found", 404))];
                }
                return [4 /*yield*/, user.deleteOne({ id: id })];
            case 2:
                _a.sent();
                return [4 /*yield*/, redis_1.redis.del(id)];
            case 3:
                _a.sent();
                res.status(200).json({
                    success: true,
                    message: "User deleted successfully",
                });
                return [3 /*break*/, 5];
            case 4:
                error_8 = _a.sent();
                return [2 /*return*/, next(new ErrorHandler_1.default(error_8.message, 500))];
            case 5: return [2 /*return*/];
        }
    });
}); });
