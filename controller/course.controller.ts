import {NextFunction,Request,Response} from "express";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import * as cloudinary from 'cloudinary';
import {createCourse, getAllCourseService} from "../services/course.service";
import CourseModel from "../models/course.model";
import {getAllUserService} from "../services/user.service";
import userModel from "../models/user.model";
import {redis} from "../util/redis";

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

//get all course content only valid user
export const getCourseByUser = CatchAsyncError(async (req:any,res:Response,next:NextFunction)=>{
    try{
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        const courseExists = userCourseList?.find(
            (course:any)=> course._id == courseId
        );

        if(!courseExists){
            return next(new ErrorHandler("You are not eligible to access this course",404));
        }
        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;

        res.status(200).json({
            success:true,
            course
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

//get all courses ->only for admin
export const getAllCoursesService = CatchAsyncError(async(req:any,res:Response,next:NextFunction)=>{
    try {
        getAllCourseService(res);
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
});

//delete course ->only for admin
export const deleteCourse = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {id} = req.params;
        const course = await CourseModel.findById(id);
        if(!course){
            return next(new ErrorHandler("Course not found",404));
        }
        await course.deleteOne({id});
        await redis.del(id);
        res.status(200).json({
            success:true,
            message:"Course deleted successfully",
        })
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
})













