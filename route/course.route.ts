import * as express from "express";
import {getAllCourses, getSingleCourse, updateCourse, uploadCourse} from "../controller/course.controller";
import {authorizeRoles} from "../middleware/auth";
const courseRouter = express.Router();


courseRouter.post("/create-course",uploadCourse);
courseRouter.put("/edit-course/:id",updateCourse);
courseRouter.get("/get-course/:id",getSingleCourse);
courseRouter.get("/get-courses",getAllCourses);

export default courseRouter;


