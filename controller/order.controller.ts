import {NextFunction,Request,Response} from "express";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import OrderModel,{IOrder} from "../models/orderModel";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../util/sendMail";
import NotificationModel from "../models/notificationModel";
import userModel from "../models/user.model";

//create order
export const createOrder = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {courseId, payment_info} = req.body as IOrder;
        const user = await userModel.findById(req.user?._id);
        const courseExistInUser = user?.courses.some((course:any)=> course._id.toString() === courseId);

        if(!courseExistInUser){
            return next(new ErrorHandler("You have already purchased this course",400));
        }
        const course = await CourseModel.findById(courseId);

        if(!course){
            return next(new ErrorHandler("Course not found",404));
        }

        const data:any ={
            courseId:courseId,
            userId: user?._id,
        }

        res.status(200).json({
            success:true,

        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

