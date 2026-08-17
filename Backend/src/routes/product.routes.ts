import express from "express"
import { verifyToken } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/checkAdmin.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { createProduct, getProduct, listProducts, updateProduct, updateProductStatus } from "../controllers/product.controller.js";
const router= express.Router()


router.post("/create",verifyToken, isAdmin, upload.single("productImage"), createProduct)
router.get("/list", verifyToken, listProducts)
router.get("/:productId", verifyToken, getProduct)
router.patch("/:productId/staus", verifyToken, isAdmin, updateProductStatus)
router.patch("/:productId/update", verifyToken, isAdmin, updateProduct)

export default router;