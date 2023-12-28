import {Request,Response,NextFunction} from "express";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import {generateLast12MonthsData} from "../util/analytics.genarator";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/orderModel";

//get user analytics
export const getUserAnalytics = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const user = await  generateLast12MonthsData(userModel);
        res.status(200).json({
            success:true,
            user
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

//get course analytics
export const getCourseAnalytics = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const course = await  generateLast12MonthsData(CourseModel);
        res.status(200).json({
            success:true,
            course
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

//get order analytics
export const getOrderAnalytics = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const order = await  generateLast12MonthsData(OrderModel);
        res.status(200).json({
            success:true,
            order
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})





