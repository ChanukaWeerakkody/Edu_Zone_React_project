import {Request,Response,NextFunction} from "express";
import userModel,{IUser} from "../models/user.model";
import ErrorHandler from "../util/ErrorHandler";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";

//Register user
interface IRegistrationBody{
    name:string;
    email:string;
    password:string;
    avatar?:string;
}

export const registerUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const {name,email,password,avatar}:IRegistrationBody = req.body;
});

























