const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateQuantity, removeItem, clearCart } = require("../controllers/cartController");
const { authorizeRoles } = require("../middlewares/authMiddleware");

// All cart routes require authentication
const authenticate = authorizeRoles();

router.get("/", authenticate, getCart);
router.post("/add", authenticate, addToCart);
router.put("/update", authenticate, updateQuantity);
router.delete("/remove/:id", authenticate, removeItem);
router.delete("/clear", authenticate, clearCart);

module.exports = router;
