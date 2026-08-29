import express from "express"
import { verifyToken } from "../middlewares/auth.middleware.js";
import { approvePurchaseOrder, cancelPurchaseOrder, createPurchaseOrder, getPurchaseOrder, getPurchaseOrders, updatePurchaseOrder } from "../controllers/purchaseOrder.controller.js";
const router= express.Router()

router.use(verifyToken)

router.post("/create", createPurchaseOrder)
router.get("/:poId", getPurchaseOrder)
router.get("/", getPurchaseOrders)
router.patch("/:poId/cancel", cancelPurchaseOrder)
router.patch("/:poId/approve", approvePurchaseOrder)
router.patch("/:poId/update", updatePurchaseOrder)

export default router;