import userModel from "../models/user.model";
import { Response } from 'express';
import {redis} from "../util/redis";

//get user by id
export const getUserById =async (id: string, res:Response) => {
    const userJson = await redis.get(id);
    if(!userJson){
        const user = JSON.parse(userJson);
        res.status(201).json({
            success: true,
            user
        })
    }
}

//get all user
export const getAllUserService = async (res:Response)=>{
    const users = await userModel.find().sort({createdAt:-1});
    res.status(201).json({
        success:true,
        users
    });
}