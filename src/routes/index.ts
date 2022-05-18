import { Router } from "express";
import searchRouter from "./search.router";
import postRouter from "./post.router";
import tokenRouter from "./token.router";
import userRouter from "./user.router";
import authRouter from "./auth.router";
import userUpdateRouter from "./userUpdate.router";
import commentPostRouter from "./comment.router";
import subcommentRouter from "./subcomment.router";

const router = Router();

router.use("/search", searchRouter);

router.use("/user", userRouter);
router.use("/user-update", userUpdateRouter);

router.use("/auth", authRouter);
router.use("/refresh-token", tokenRouter);

router.use("/post", postRouter);

router.use("/comment", commentPostRouter);
router.use("/subcomment", subcommentRouter);

export default router;
