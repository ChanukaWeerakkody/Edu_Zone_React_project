import * as path from "path";
import {NextFunction,Request,Response} from "express";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import OrderModel,{IOrder} from "../models/orderModel";
import UserModel from "../models/user.model";
import CourseModel from "../models/course.model";
import * as ejs from "ejs";
import sendMail from "../util/sendMail";
import NotificationModel from "../models/notificationModel";
import userModel from "../models/user.model";
import {getAllOrderService, newOrder} from "../services/order.service";
import {getAllUserService} from "../services/user.service";
import {redis} from "../util/redis";


//create order
export const createOrder = CatchAsyncError(async (req:any,res:Response,next:NextFunction)=>{
    try{
        const {courseId, payment_info} = req.body as IOrder;
        /*const user = await userModel.findById(req.user?._id);*/
        const user = await userModel.findById('65717e56cb7f7d716169bbea');
        const courseExistInUser = user?.courses.some((course:any)=> course._id.toString() === courseId);

        if(courseExistInUser){
            return next(new ErrorHandler("You have already purchased this course",400));
        }
        const course = await CourseModel.findById(courseId);

        if(!course){
            return next(new ErrorHandler("Course not found",404));
        }

        const data:any ={
            courseId:courseId,
            userId: user?._id,
            payment_info
        }

        const mailData = {
            order: {
                _id:course._id.toString().slice(0,6),
                name:course.name,
                price:course.price,
                date : new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'}),
            }
        }

        const html = ejs.renderFile(path.join(__dirname,'../mails/order-confirmation.ejs'),{order:mailData});

        try{
            if(user){
                await sendMail({
                    email:user.email,
                    subject:"Order Confirmation",
                    template:"order-confirmation.ejs",
                    data:mailData
                })
            }
        }catch (err:any){
            return next(new ErrorHandler(err.message,500));
        }

        user?.courses.push(course?._id);
        await user?.save();

        const notification = await NotificationModel.create({
            userId: user?._id,
            title: "New Order",
            message: `You have a new order from ${course?.name} course`
        })

        if(notification){
            course.purchased += 1;
        }
        await course.save();

        newOrder(data,res,next);

    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

//get all orders ->only for admin
export const getAllOrders = CatchAsyncError(async(req:any,res:Response,next:NextFunction)=>{
    try {
        getAllOrderService(res);
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
});

//delete order ->only for admin
export const deleteOrder = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} = req.params;
        const order = await OrderModel.findById(id);
        if(!order){
            return next(new ErrorHandler("Order not found",404));
        }
        await order.deleteOne({id});
        await redis.del(id);
        res.status(200).json({
            success:true,
            message:"Order deleted successfully",
        })
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
})
