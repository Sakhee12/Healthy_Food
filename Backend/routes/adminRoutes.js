const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    updateUserRole,
    deleteUser,
    getRoles,
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/adminController");
const { authorizeRoles, authenticateOptional } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Helper for brevity
const superAdminAndAdmin = authorizeRoles('superadmin', 'admin');
const allAdminsAndManagers = authorizeRoles('superadmin', 'admin', 'manager');

// User Management (Super Admin & Admin only)
router.get("/users", superAdminAndAdmin, getAllUsers);
router.put("/update-role", superAdminAndAdmin, updateUserRole);
router.delete("/delete-user/:id", superAdminAndAdmin, deleteUser);
router.get("/roles", superAdminAndAdmin, getRoles);

// Category Management
router.get("/categories", authenticateOptional, getAllCategories); // Optional auth to catch user details if logged in
router.post("/categories/add", authenticateOptional, upload.fields([
    { name: 'category_image_file', maxCount: 1 },
    { name: 'banner_image_file', maxCount: 1 }
]), addCategory);
router.put("/categories/update/:id", authenticateOptional, upload.fields([
    { name: 'category_image_file', maxCount: 1 },
    { name: 'banner_image_file', maxCount: 1 }
]), updateCategory);
router.delete("/categories/delete/:id", authenticateOptional, deleteCategory);

// Order Management (Super Admin, Admin & Manager)
router.get("/orders", allAdminsAndManagers, (req, res) => res.json([]));
router.put("/orders/update-status", allAdminsAndManagers, (req, res) => res.json({ message: "Order status updated" }));

module.exports = router;
