import * as express from "express";
import {createOrder} from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order",createOrder);

export default orderRouter;






