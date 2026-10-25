import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wordoraRouter from "./wordora";
import learningRouter from "./learning";

const router: IRouter = Router();

router.use(healthRouter);
router.use(wordoraRouter);
router.use(learningRouter);

export default router;
