import NotificationModel from "../models/notificationModel";
import { NextFunction,Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import * as cron from "node-cron";

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
});

//update notification ->only for admin
export const updateNotification = CatchAsyncError(async (req:any,res:Response,next:NextFunction)=>{
    try{
        const notification = await NotificationModel.findById(req.params.id);

        if(!notification){
            return next(new ErrorHandler("Notification not found",404));
        }else {
            notification.status ? notification.status = "read" : notification?.status;
        }

        await notification.save();
        const notifications = await NotificationModel.find().sort({createdAt:-1});

        res.status(201).json({
            success:true,
            notifications
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
});

//delete notification ->only for admin
cron.schedule("*/5 * * * * *",function (){
    console.log("---------------------------");
    console.log("running a task every 5 seconds");
});














