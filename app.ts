import cookieParser = require("cookie-parser");
import { Request, Response, NextFunction } from "express";
require('dotenv').config();
import * as express from "express";
export const app = express();

import * as cors from "cors";
import {ErrorMiddleware} from "./middleware/error";

//body parser
app.use(express.json({limit: "50mb"}));

//cookie-parser
app.use(cookieParser());

//cors => cross origin resource sharing
app.use(cors({
    origin: process.env.ORIGIN
}));

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: "Test route successful",
    });
});

//unknown route
app.all("*",(req:Request, res:Response, next:NextFunction) =>{
    const err = new Error(`Route ${req.originalUrl} not found`)as any;
    err.statusCode =404;
    next(err);
});

app.use(ErrorMiddleware);