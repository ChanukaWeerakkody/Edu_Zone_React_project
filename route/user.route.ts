import * as express from "express";
import {
    activateUser,
    getUserInfo,
    loginUser,
    logoutUser,
    registerUser, socialAuth,
    updateAccessToken
} from "../controller/user.controller";
import {authorizeRoles, isAuthenticated} from "../middleware/auth";
const userRouter = express.Router();

userRouter.post("/registration",registerUser);

userRouter.post("/activate-user",activateUser);

userRouter.post("/login",loginUser);

userRouter.get("/logout",logoutUser);

userRouter.get("/refreshToken",updateAccessToken);

userRouter.get("/me",getUserInfo);

userRouter.post("/socialAuth",socialAuth);

export default userRouter;