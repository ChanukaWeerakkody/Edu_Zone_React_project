import * as express from "express";
import {createOrder, getAllOrders} from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order",createOrder);
orderRouter.get("/getAll-orders",getAllOrders);

export default orderRouter;






