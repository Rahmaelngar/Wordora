import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wordoraRouter from "./wordora";

const router: IRouter = Router();

router.use(healthRouter);
router.use(wordoraRouter);

export default router;
