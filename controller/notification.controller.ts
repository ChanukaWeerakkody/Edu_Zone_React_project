import NotificationModel from "../models/notificationModel";
import { NextFunction,Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";

//get all notifications ->only for admin
export const getNotifications = CatchAsyncError(async (req:any,res:Response,next:NextFunction)=>{
    try{
        const notification = await NotificationModel.find().sort({createdAt:-1});
        res.status(201).json({
            success:true,
            notification
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})