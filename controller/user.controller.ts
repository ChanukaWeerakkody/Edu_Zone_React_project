import * as path from "path";

require('dotenv').config();
import {Request,Response,NextFunction} from "express";
import ErrorHandler from "../util/ErrorHandler";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import userModel, {IUser} from "../models/user.model";
import * as jwt from "jsonwebtoken";
import * as ejs from "ejs";

import user from "../models/user.model";


import * as bcrypt from "bcryptjs";
import {Secret} from "jsonwebtoken";
import sendMail from "../util/sendMail";



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
        const html = ejs.renderFile(path.join(__dirname,"../mails/activation-mail.ejs"),data);

        try{
            await sendMail({
                email:user.email,
                subject:"Activate your account",
                template:"activation-mail.ejs",
                data,
            });

            res.status(200).json({
                success:true,
                message:`Account created successfully, please check ${user.email} to activate your account`,
                activationToken:activationToken.token,
            });
        }catch (error){
            return next(new ErrorHandler(error.message,500));
        }

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

//Activate user
interface IActivationRequest{
    activation_token:string;
    activation_Code:string;
}

export const activateUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {activation_token,activation_Code} = req.body as IActivationRequest;

        const newUser:{user,activationCode} = jwt.verify(activation_token,process.env.ACTIVATION_SECRET as string
        ) as { user:IUser,activationCode:string };

        if(newUser.activationCode !== activation_Code){
            return next(new ErrorHandler("Invalid activation code",400));
        }

        const {name,email,password} = newUser.user;

        const existUser = await userModel.findOne({email});

        if(existUser){
            return next(new ErrorHandler("User already exists",400));
        }

        const user = await userModel.create({
            name,email,password
        });

        res.status(200).json({
            success:true,
            message:"Account activated successfully",
            user
        })

    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
});


























