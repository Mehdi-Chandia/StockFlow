import express from "express"
import { verifyToken } from "../middlewares/auth.middleware.js";
import { cancelOrder, createOrder, getOrder, getOrders, getProductOrders, getWareHouseOrders, updateOrderStatus } from "../controllers/order.controller.js";
const router= express.Router();

router.use(verifyToken)

router.post("/create-order", createOrder)
router.get("/:warehouseId/warehouse", getWareHouseOrders)
router.get("/:productId/product", getProductOrders)
router.get("/:orderId", getOrder)
router.get("/getOrders", getOrders)
router.patch("/update/status", updateOrderStatus)
router.patch("/cancel", cancelOrder)


export default router;