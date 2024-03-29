import * as path from "path";

require('dotenv').config();
import {Request,Response,NextFunction} from "express";
import ErrorHandler from "../util/ErrorHandler";
import {CatchAsyncError} from "../middleware/catchAsyncErrors";
import userModel, {IUser} from "../models/user.model";
import * as jwt from "jsonwebtoken";
import * as ejs from "ejs";
import {JwtPayload, Secret} from "jsonwebtoken";
import sendMail from "../util/sendMail";
import {accessTokenOptions, refreshTokenOptions, sendToken} from "../util/jwt";
import {redis} from "../util/redis";
import {getAllUserService, getUserById} from "../services/user.service";

/**/
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

//Login user
interface ILoginRequest{
    email:string;
    password:string;
}

export const loginUser = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {email,password} = req.body as ILoginRequest;
        if (!email || !password){
            return next(new ErrorHandler("Please enter email and password",400));
        }

        const user = await userModel.findOne({email}).select("+password");

        if(!user){
            return next(new ErrorHandler("Invalid email or password",400));
        }

        const isPasswordMatched = await user.comparePassword(password);

        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid email or password",400));
        }

        sendToken(user,200,res);

    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
});

//Logout user
export const logoutUser = CatchAsyncError(async(req:any,res:Response,next:NextFunction)=>{
    try{
        res.cookie("access_token","",{maxAge:1});
        res.cookie("refresh_token","",{maxAge:1});

        const userId =req.user?.id || "";
        redis.del(userId);

        res.status(200).json({
            success:true,
            message:"Logged out successfully",
        })

    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
})

//update access token
export const updateAccessToken = CatchAsyncError(async(req:any,res:Response,next:NextFunction)=>{
    try {
        const refresh_token = req.cookies.refresh_token as string;

        const decoded = jwt.verify(refresh_token,process.env.REFRESH_TOKEN as string) as JwtPayload;

        const message = "Could not refresh token";
        if (!decoded) {
            return next(new ErrorHandler(message, 401));
        }

        const session = await redis.get(decoded.id as string);

        if (!session) {
            return next(new ErrorHandler(message, 401));
        }

        const user = JSON.parse(session);
        const accessToken = jwt.sign({id:user._id},process.env.ACCESS_TOKEN as string,{
            expiresIn:"5m"
        })

        const refreshToken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN as string,{
            expiresIn:"3d"
        })

        req.user = user;

        res.cookie("access_token",accessToken,accessTokenOptions);
        res.cookie("refresh_token",refreshToken,refreshTokenOptions);

        res.status(200).json({
            success:true,
            accessToken
        })

    }catch (error:any) {
        return next(new ErrorHandler(error.message,500));
    }
})

//get user info
export const getUserInfo = CatchAsyncError(async(req:any,res:Response,next:NextFunction)=>{
    try {
        const userId = req.user?._id;
        getUserById(userId,res);
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
})

interface ISocialAuthBody{
    email:string;
    name:string;
    avatar?:string;
}

//social auth
export const socialAuth = CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,name,avatar} = req.body as ISocialAuthBody;
        const user = await userModel.findOne({email});
        if(!user){
            const newUser = await userModel.create({name,email,avatar})
            sendToken(newUser,200,res);
        }else{
            sendToken(user,200,res);
        }
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
})

//update user info
interface IUpdateUserInfo{
    name?:string;
    email?:string;
}

export const updateUserInfo = CatchAsyncError(async(req:any,res:Response,next:NextFunction)=>{
    try {
        const userId = req.user?._id;
        const {name,email} = req.body as IUpdateUserInfo;
        const user = await userModel.findById(userId);

        if(email && user){
            const isEmailExist = await userModel.findOne({email});
            if(isEmailExist){
                return next(new ErrorHandler("Email already exists",400));
            }
            user.email = email;
        }
        if(name && user){
            user.name = name;
        }
        await user?.save();
        await redis.set(userId,JSON.stringify(user));

        res.status(201).json({
            success:true,
            user
        })
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
})

//get all users ->only for admin
export const getAllUsers = CatchAsyncError(async(req:any,res:Response,next:NextFunction)=>{
    try {
        getAllUserService(res);
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
});

//delete user ->only for admin
export const deleteUser = CatchAsyncError(async(req:any,res:Response,next:NextFunction)=>{
    try {
        const id = req.params.id;
        const user = await userModel.findById(id);
        if(!user){
            return next(new ErrorHandler("User not found",404));
        }
        await user.deleteOne({id});
        await redis.del(id);
        res.status(200).json({
            success:true,
            message:"User deleted successfully",
        })
    }catch (error:any){
        return next(new ErrorHandler(error.message,500));
    }
})
















