import * as express from "express";
import {getCourseAnalytics, getOrderAnalytics, getUserAnalytics} from "../controller/analytics.controller";
const analyticsRouter = express.Router();

analyticsRouter.get("/get-user-analytic",getUserAnalytics);
analyticsRouter.get("/get-course-analytic",getCourseAnalytics);
analyticsRouter.get("/get-order-analytic",getOrderAnalytics);

export default analyticsRouter;