import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import formsRouter from "./forms.js";
import fieldsRouter from "./fields.js";
import submissionsRouter from "./submissions.js";
import publicRouter from "./public.js";
import templatesRouter from "./templates.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(formsRouter);
router.use(fieldsRouter);
router.use(submissionsRouter);
router.use(publicRouter);
router.use(templatesRouter);

export default router;
