import { Router } from "express";
import TokenController from "../controllers/token.controller";

const tokenRouter = Router();

tokenRouter.post("/", TokenController.refresh);

export default tokenRouter;
