import * as express from "express";
import {updateCourse, uploadCourse} from "../controller/course.controller";
import {authorizeRoles} from "../middleware/auth";
const courseRouter = express.Router();


courseRouter.post("/create-course",uploadCourse);
courseRouter.put("/edit-course/:id",updateCourse);

export default courseRouter;


