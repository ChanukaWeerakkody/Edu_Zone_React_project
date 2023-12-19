import {NextFunction,Request,Response} from "express";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import * as cloudinary from 'cloudinary';


export const uploadCourse = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const data =req.body;
        const thumbnail = data.thumbnail;

        if(thumbnail){
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"courses"
            })

            data.thumbnail = {
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        }
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})