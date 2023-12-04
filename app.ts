import cookieParser = require("cookie-parser");

require('dotenv').config();
import * as express from "express";
export const app = express();

import * as cors from "cors";

//body parser
app.use(express.json({limit: "50mb"}));

//cookie-parser
app.use(cookieParser());

//cors => cross origin resource sharing
app.use(cors({
    origin: process.env.ORIGIN
}));

//testing api






