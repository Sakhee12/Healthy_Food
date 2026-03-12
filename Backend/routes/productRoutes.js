const express = require("express");
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, deleteProduct, getFeaturedProducts, getTrendingProducts } = require("../controllers/productController");
const { authorizeRoles } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Permissions
const canManageProducts = authorizeRoles('superadmin', 'admin', 'manager');
const canDeleteProducts = authorizeRoles('superadmin', 'admin');

// Public Listing (Truly public)
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/trending", getTrendingProducts);
router.post("/add", canManageProducts, upload.fields([
    { name: 'product_image_file', maxCount: 1 },
    { name: 'image2_file', maxCount: 1 },
    { name: 'image3_file', maxCount: 1 }
]), addProduct);
router.put("/update/:id", upload.fields([
    { name: 'product_image_file', maxCount: 1 },
    { name: 'image2_file', maxCount: 1 },
    { name: 'image3_file', maxCount: 1 }
]), canManageProducts, updateProduct);
router.delete("/delete/:id", canDeleteProducts, deleteProduct);

module.exports = router;
