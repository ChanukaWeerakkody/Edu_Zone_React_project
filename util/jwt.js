"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = void 0;
require('dotenv').config();
var redis_1 = require("./redis");
var sendToken = function (user, statusCode, res) {
    var accessToken = user.signAccessToken();
    var refreshToken = user.signRefreshToken();
    //upload session to redis
    redis_1.redis.set(user._id, JSON.stringify(user));
    //parse environment variables to integrates with fallback values
    var accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
    var refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);
    //options for cookies
    var accessTokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    };
    var refreshTokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: refreshTokenExpire * 1000,
        httpOnly: true,
        sameSite: 'lax',
    };
    //only set secure to true in production
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
    }
    res.cookie('access_Token', accessToken, accessTokenOptions);
    res.cookie('refresh_Token', refreshToken, refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user: user,
        accessToken: accessToken
    });
};
exports.sendToken = sendToken;
