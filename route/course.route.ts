import * as express from "express";
import {
    deleteCourse,
    getAllCourses, getAllCoursesService,
    getCourseByUser,
    getSingleCourse,
    updateCourse,
    uploadCourse
} from "../controller/course.controller";
import {authorizeRoles} from "../middleware/auth";
const courseRouter = express.Router();


courseRouter.post("/create-course",uploadCourse);
courseRouter.put("/edit-course/:id",updateCourse);
courseRouter.get("/get-course/:id",getSingleCourse);
courseRouter.get("/get-courses",getAllCourses);
courseRouter.get("/get-course-content/:id",getCourseByUser);
courseRouter.get("/getAll-courses",getAllCoursesService);
courseRouter.delete("/delete-course/:id",deleteCourse);

export default courseRouter;


