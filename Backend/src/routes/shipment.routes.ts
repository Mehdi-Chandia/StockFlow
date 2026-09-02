import express from "express"
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getShipment, getShipments, receiveShipment } from "../controllers/shipment.controller.js";
const router= express.Router();

router.use(verifyToken)

router.post("/receive", receiveShipment)
router.get("/:shipmentId", getShipment)
router.get("/", getShipments)

export default router;