import { Router, type IRouter } from "express";
import healthRouter from "./health";
import repositoriesRouter from "./repositories";
import bugsRouter from "./bugs";
import patchesRouter from "./patches";
import translationsRouter from "./translations";
import vulnerabilitiesRouter from "./vulnerabilities";
import agentsRouter from "./agents";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(repositoriesRouter);
router.use(bugsRouter);
router.use(patchesRouter);
router.use(translationsRouter);
router.use(vulnerabilitiesRouter);
router.use(agentsRouter);
router.use(dashboardRouter);

export default router;
