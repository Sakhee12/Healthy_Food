const db = require("../config/db");

const Variant = {
    getAll: (callback) => {
        db.query(`
            SELECT v.*, p.product_name 
            FROM product_variants v
            LEFT JOIN products p ON v.product_id = p.id
            ORDER BY v.id DESC
        `, callback);
    },

    getById: (id, callback) => {
        db.query(`
            SELECT v.*, p.product_name 
            FROM product_variants v
            LEFT JOIN products p ON v.product_id = p.id
            WHERE v.id = ?
        `, [id], callback);
    },

    getByProductId: (productId, callback) => {
        db.query(`
            SELECT * FROM product_variants 
            WHERE product_id = ? 
            ORDER BY price ASC
        `, [productId], callback);
    },

    create: (data, callback) => {
        const sql = "INSERT INTO product_variants (product_id, variant_name, price, stock) VALUES (?, ?, ?, ?)";
        db.query(sql, [data.product_id, data.variant_name, data.price || 0, data.stock || 0], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE product_variants SET product_id = COALESCE(?, product_id), variant_name = COALESCE(?, variant_name), price = COALESCE(?, price), stock = COALESCE(?, stock) WHERE id = ?";
        db.query(sql, [data.product_id, data.variant_name, data.price, data.stock, id], callback);
    },

    delete: (id, callback) => {
        db.query("DELETE FROM product_variants WHERE id = ?", [id], callback);
    }
};

module.exports = Variant;
