import * as express from "express";
import {createOrder, deleteOrder, getAllOrders} from "../controller/order.controller";

const orderRouter = express.Router();

orderRouter.post("/create-order",createOrder);
orderRouter.get("/getAll-orders",getAllOrders);
orderRouter.delete("/delete-order/:id",deleteOrder);

export default orderRouter;






