import * as express from "express";
import {activateUser, loginUser, logoutUser, registerUser, updateAccessToken} from "../controller/user.controller";
import {authorizeRoles, isAuthenticated} from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration",registerUser);

userRouter.post("/activate-user",activateUser);

userRouter.post("/login",loginUser);

userRouter.get("/logout",logoutUser);

userRouter.get("/refreshToken",updateAccessToken);

export default userRouter;