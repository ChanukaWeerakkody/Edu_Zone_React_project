import { app } from "./app";
import connectDB from "./util/db";
require("dotenv").config();


//create server
app.listen(process.env.PORT, () =>{
    console.log(`server is connected with ${process.env.PORT}`);
    connectDB();
});