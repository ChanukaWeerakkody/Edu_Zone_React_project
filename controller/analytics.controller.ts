import {Request,Response,NextFunction} from "express";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import {generateLast12MonthsData} from "../util/analytics.genarator";
import userModel from "../models/user.model";

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









