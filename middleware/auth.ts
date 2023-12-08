import {Request,Response,NextFunction} from "express";
import {CatchAsyncError} from "./catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import {redis} from "../util/redis";
import * as jwt from 'jsonwebtoken';
import {JwtPayload} from "jsonwebtoken";


//Check
// if user is authenticated
export const isAuthenticated = CatchAsyncError(async (req:any,res:any,next:any)=>{
    const access_token = req.cookies.accessToken as string;

    if(!access_token){
        return next(new ErrorHandler("Please login to access this resource",401));
    }

    const decoded = jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload;

    if(!decoded){
        return next(new ErrorHandler("Access token is not valid",401));
    }

    const user = await redis.get(decoded.id);

    if(!user){
        return next(new ErrorHandler("User not found",401));
    }

    req.user = JSON.parse(user);
    next();
});



