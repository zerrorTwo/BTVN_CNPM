import { Router } from "express";
import productRoutes from "./products";
import favoriteRoutes from "./favorites";
import commentRoutes from "./comments";
import productViewRoutes from "./productViews";
import cartRoutes from "./cart";
import authRoutes from "./auth";
import categoryRoutes from "./categories";
import orderRoutes from "./orders";

const router = Router();

router.use("/products", productRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/comments", commentRoutes);
router.use("/product-views", productViewRoutes);
router.use("/cart", cartRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);

export default router;
