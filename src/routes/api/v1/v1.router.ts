import { Router } from "express";
import graphqlRouter from "./graphql.router";
import uploadRouter from "./upload.router";
import authRouter from "./auth.router";
const router = Router();

router.use("/graphql", graphqlRouter);
router.use("/upload", uploadRouter);
router.use("/auth", authRouter);
export default router;
