const Cart = require("../models/cartModel");
const db = require("../config/db");

// Get user cart
exports.getCart = (req, res) => {
  const userId = req.user.id;

  Cart.findOrCreate(userId, (err, cart) => {
    if (err) return res.status(500).json({ message: "Error accessing cart", error: err });

    Cart.getItems(cart.id, (err, items) => {
      if (err) return res.status(500).json({ message: "Error fetching cart items" });
      res.json({
        cartId: cart.id,
        totalItems: cart.total_items,
        totalPrice: cart.total_price,
        items
      });
    });
  });
};

// Add product to cart
exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }

  // 1. Get product price
  db.query("SELECT price FROM products WHERE id = ?", [productId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const price = results[0].price;

    // 2. Find or create cart
    Cart.findOrCreate(userId, (err, cart) => {
      if (err) return res.status(500).json({ message: "Error accessing cart" });

      // 3. Add item
      Cart.addItem(cart.id, productId, quantity, price, (err) => {
        if (err) return res.status(500).json({ message: "Error adding item to cart" });

        // 4. Update cart totals
        Cart.updateCartTotals(cart.id, (err) => {
          if (err) console.error("Error updating cart totals:", err);
          res.json({ message: "Product added to cart ✅" });
        });
      });
    });
  });
};

// Update cart item quantity
exports.updateQuantity = (req, res) => {
  const { cartItemId, quantity } = req.body;

  if (!cartItemId || quantity === undefined) {
    return res.status(400).json({ message: "Cart item ID and quantity are required" });
  }

  if (quantity <= 0) {
    return this.removeItem({ params: { id: cartItemId }, user: req.user }, res);
  }

  Cart.updateItemQuantity(cartItemId, quantity, (err) => {
    if (err) return res.status(500).json({ message: "Error updating quantity", error: err.message });

    // Find cart_id for this item to update totals
    db.query("SELECT cart_id FROM cart_items WHERE id = ?", [cartItemId], (err, results) => {
      if (err || results.length === 0) return res.json({ message: "Quantity updated ✅" });

      Cart.updateCartTotals(results[0].cart_id, (err) => {
        if (err) console.error("Error updating cart totals:", err);
        res.json({ message: "Quantity updated ✅" });
      });
    });
  });
};

// Remove item from cart
exports.removeItem = (req, res) => {
  const { id } = req.params;

  // Find cart_id for this item before deleting it
  db.query("SELECT cart_id FROM cart_items WHERE id = ?", [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    const cartId = results[0].cart_id;

    Cart.removeItem(id, (err) => {
      if (err) return res.status(500).json({ message: "Error removing item" });

      Cart.updateCartTotals(cartId, (err) => {
        if (err) console.error("Error updating cart totals:", err);
        res.json({ message: "Item removed from cart ✅" });
      });
    });
  });
};

// Clear cart
exports.clearCart = (req, res) => {
  const userId = req.user.id;
  Cart.findOrCreate(userId, (err, cart) => {
    if (err) return res.status(500).json({ message: "Error accessing cart" });

    Cart.clearItems(cart.id, (err) => {
      if (err) return res.status(500).json({ message: "Error clearing cart" });

      Cart.updateCartTotals(cart.id, (err) => {
        if (err) console.error("Error updating cart totals:", err);
        res.json({ message: "Cart cleared ✅" });
      });
    });
  });
};
