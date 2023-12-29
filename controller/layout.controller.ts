import {Request,Response,NextFunction} from "express";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import ErrorHandler from "../util/ErrorHandler";
import * as cloudinary from "cloudinary";
import LayoutModel from "../models/layout.model";

//create layout
export const createLayout = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {type} = req.body;
        const isTypeExist = await LayoutModel.findOne({type});
        if(isTypeExist){
            return next(new ErrorHandler("Type already exists",400));
        }
        if(type === "Banner"){
            const {image,title,subTitle} = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image,{
                folder:"layout",
            });
            const banner ={
                image:{
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url
                },
                title,
                subTitle
            }
            await LayoutModel.create(banner);
        }
        if(type === "FAQ"){
            const {faq} = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item:any)=>{
                    return{
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.create({type:"FAQ",faq:faqItems});
        }

        if(type === "Categories"){
            const {categories} = req.body;
            const categoryItems = await Promise.all(
                categories.map(async (item:any)=>{
                    return{
                        title: item.title,
                    }
                })
            )
            await LayoutModel.create({type:"Categories",categories:categoryItems});
        }
        res.status(200).json({
            success:true,
            message:"Layout created successfully"
        })

    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})

//get layout
export const getLayoutByType = CatchAsyncError(async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const {type} = req.body;
        const layout = await LayoutModel.findOne(type);
        res.status(200).json({
            success:true,
            layout
        })
    }catch (err:any){
        return next(new ErrorHandler(err.message,500));
    }
})
