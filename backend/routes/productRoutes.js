import express from "express";
import {
  getProducts,
  getProductById,
  getProductStats,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductFeatured,
  toggleProductDestockage,
  toggleProductComingSoon,
  updateProductStatus,
  updateProductUniverse,
  updateProductSubUniverse,
  duplicateProduct,
  createProductReview,
  getTopProducts,
  getFeaturedProducts,
  getDestockageProducts,
  getComingSoonProducts,
  getNewProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/stats", getProductStats);
router.get("/top", getTopProducts);
router.get("/featured", getFeaturedProducts);
router.get("/destockage", getDestockageProducts);
router.get("/coming-soon", getComingSoonProducts);
router.get("/new", getNewProducts);

// Routes avec ID
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

// Routes spéciales (protégées)
router.post("/:id/reviews", protect, createProductReview);
router.put("/:id/featured", protect, admin, toggleProductFeatured);
router.put("/:id/destockage", protect, admin, toggleProductDestockage);
router.put("/:id/coming-soon", protect, admin, toggleProductComingSoon);
router.put("/:id/status", protect, admin, updateProductStatus);
router.put("/:id/universe", protect, admin, updateProductUniverse);
router.put("/:id/subuniverse", protect, admin, updateProductSubUniverse);
router.post("/:id/duplicate", protect, admin, duplicateProduct);

export default router;