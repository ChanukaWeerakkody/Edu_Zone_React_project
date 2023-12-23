import {NextFunction,Request,Response} from "express";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import * as cloudinary from 'cloudinary';
import {createCourse} from "../services/course.service";
import CourseModel from "../models/course.model";

//add course
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
        createCourse(data,res,next);
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

//update course
export const updateCourse = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const data =req.body;
        const thumbnail = data.thumbnail;

        if(thumbnail){
            await cloudinary.v2.uploader.destroy(data.thumbnail.public_id);
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"courses"
            })
            data.thumbnail = {
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        }

        const courseId=req.params.id;
        const course = await CourseModel.findByIdAndUpdate(courseId,{
            $set:data},
            {new:true
        })
        res.status(200).json({
            success:true,
            course
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

//get single course
export const getSingleCourse = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links");
        res.status(200).json({
            success:true,
            course
        })

    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

//get all courses without purchased
export const getAllCourses = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const courses= await CourseModel.find().select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links");
        res.status(200).json({
            success:true,
            courses
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})


















