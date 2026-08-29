import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getAudit, getAudits } from "../controllers/auditLog.controller.js";
const router= express.Router();

router.use(verifyToken);

router.get("/:auditId", getAudit);
router.get("/", getAudits);

export default router;