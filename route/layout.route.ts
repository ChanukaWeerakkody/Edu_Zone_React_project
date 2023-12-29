import * as express from "express";
import {createLayout, getLayoutByType} from "../controller/layout.controller";

const layoutRouter = express.Router();

layoutRouter.post("/create-layout", createLayout);
layoutRouter.get("/get-layout", getLayoutByType);

export default layoutRouter;