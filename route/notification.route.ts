import * as express from "express";
import {getNotifications} from "../controller/notification.controller";
const notificationRoute = express.Router();

notificationRoute.get("/get-all-notifications", getNotifications);

export default notificationRoute;