import path from "path";

require('dotenv').config();
import {Request,Response,NextFunction} from "express";
import ErrorHandler from "../util/ErrorHandler";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import * as bcrypt from "bcryptjs";
import userModel, {IUser} from "../models/user.model";
import jwt, {Secret} from "jsonwebtoken";
import ejs from "ejs";

//Register user
interface IRegistrationBody{
    name:string;
    email:string;
    password:string;
    avatar?:string;
}

export const registerUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {name,email,password} = req.body;

        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return next(new ErrorHandler("Email already exists",400));
        }

        const user:IRegistrationBody = {
            name,
            email,
            password,
        }

        const activationToken = createActivationToken(user);
        const activationCode = activationToken.activationCode;

        const data = {user:{name:user.name},activationCode};
        const html = ejs.renderFile(path.join(__dirname,"../views/activation.ejs"),data);

    }catch (error){
        return next(new ErrorHandler(error.message,500));
    }
});

interface IActivationToken{
    token:string
    activationCode:string;
}

export const createActivationToken = (user:any):IActivationToken =>{
    const activationCode = Math.floor(1000+Math.random()*9000).toString();

    const token = jwt.sign({
            user,activationCode
    },process.env.ACTIVATION_SECRET as Secret,{
        expiresIn:"5m"
    });
    return {token,activationCode};
}


























