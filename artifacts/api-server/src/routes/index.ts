import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import dashboardRouter from "./dashboard.js";
import formsRouter from "./forms.js";
import submissionsRouter from "./submissions.js";
import publicRouter from "./public.js";
import templatesRouter from "./templates.js";
import aiRouter from "./ai.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dashboardRouter);
router.use(formsRouter);
router.use(submissionsRouter);
router.use(publicRouter);
router.use(templatesRouter);
router.use(aiRouter);

export default router;
