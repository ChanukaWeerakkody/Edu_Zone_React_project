import ErrorHandler  from "../util/ErrorHandler";
import {NextFunction} from "express";

export const ErrorMiddleware = (err:any, req:any, res:any, next:any) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error"

    //wrong mongo id error
    if(err.name === 'castError'){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    //Wrong jwt error
    if(err.name=== 'JsonWebTokenError'){
        const message = `Json web token is invalid. Try again`;
        err = new ErrorHandler(message, 400);
    }

    //jwt expire error
    if(err.name=== 'TokenExpiredError'){
        const message = `Json web token is expired. Try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}