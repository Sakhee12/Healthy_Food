const db = require("../config/db");

const Cart = {
  // Find or create a cart for a user
  findOrCreate: (userId, callback) => {
    db.query("SELECT * FROM carts WHERE user_id = ?", [userId], (err, result) => {
      if (err) return callback(err);
      if (result.length > 0) return callback(null, result[0]);

      db.query("INSERT INTO carts (user_id) VALUES (?)", [userId], (err, insertResult) => {
        if (err) return callback(err);
        db.query("SELECT * FROM carts WHERE id = ?", [insertResult.insertId], (err, newCart) => {
          if (err) return callback(err);
          callback(null, newCart[0]);
        });
      });
    });
  },

  // Get items in a cart with product details
  getItems: (cartId, callback) => {
    const sql = `
      SELECT ci.*, p.product_name, p.product_image, p.price as current_price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `;
    db.query(sql, [cartId], callback);
  },

  // Add item to cart or update quantity
  addItem: (cartId, productId, quantity, price, callback) => {
    const totalPrice = quantity * price;
    db.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cartId, productId],
      (err, result) => {
        if (err) return callback(err);

        if (result.length > 0) {
          // Update existing item
          const newQuantity = result[0].quantity + quantity;
          const newTotalPrice = newQuantity * price;
          db.query(
            "UPDATE cart_items SET quantity = ?, total_price = ? WHERE id = ?",
            [newQuantity, newTotalPrice, result[0].id],
            callback
          );
        } else {
          // Insert new item
          db.query(
            "INSERT INTO cart_items (cart_id, product_id, quantity, price, total_price) VALUES (?, ?, ?, ?, ?)",
            [cartId, productId, quantity, price, totalPrice],
            callback
          );
        }
      }
    );
  },

  // Update item quantity directly
  updateItemQuantity: (cartItemId, quantity, callback) => {
    // First get the price to recalculate total_price
    db.query("SELECT price FROM cart_items WHERE id = ?", [cartItemId], (err, result) => {
      if (err) return callback(err);
      if (result.length === 0) return callback(new Error("Cart item not found"));

      const price = result[0].price;
      const totalPrice = quantity * price;
      db.query(
        "UPDATE cart_items SET quantity = ?, total_price = ? WHERE id = ?",
        [quantity, totalPrice, cartItemId],
        callback
      );
    });
  },

  // Remove item from cart
  removeItem: (cartItemId, callback) => {
    db.query("DELETE FROM cart_items WHERE id = ?", [cartItemId], callback);
  },

  // Clear all items from a cart
  clearItems: (cartId, callback) => {
    db.query("DELETE FROM cart_items WHERE cart_id = ?", [cartId], callback);
  },

  // Sync cart totals (total_items, total_price)
  updateCartTotals: (cartId, callback) => {
    const sql = `
      UPDATE carts 
      SET 
        total_items = (SELECT SUM(quantity) FROM cart_items WHERE cart_id = ?),
        total_price = (SELECT SUM(total_price) FROM cart_items WHERE cart_id = ?)
      WHERE id = ?
    `;
    // If no items, subqueries return NULL, so we handle that in the update status call later if needed
    // or use COALESCE
    const sqlCoalesce = `
      UPDATE carts 
      SET 
        total_items = COALESCE((SELECT SUM(quantity) FROM cart_items WHERE cart_id = ?), 0),
        total_price = COALESCE((SELECT SUM(total_price) FROM cart_items WHERE cart_id = ?), 0)
      WHERE id = ?
    `;
    db.query(sqlCoalesce, [cartId, cartId, cartId], callback);
  }
};

module.exports = Cart
