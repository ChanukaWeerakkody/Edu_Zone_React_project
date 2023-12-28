import * as express from "express";
import {getNotifications, updateNotification} from "../controller/notification.controller";
const notificationRoute = express.Router();

notificationRoute.get("/get-all-notifications", getNotifications);
notificationRoute.put("/update-notifications/:id", updateNotification);

export default notificationRoute;