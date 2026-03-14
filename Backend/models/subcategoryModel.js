const db = require("../config/db");

const Subcategory = {
    getAll: (callback) => {
        db.query(`
            SELECT s.*, c.category_name 
            FROM subcategories s
            LEFT JOIN categories c ON s.category_id = c.id
            ORDER BY s.name ASC
        `, callback);
    },

    getById: (id, callback) => {
        db.query(`
            SELECT s.*, c.category_name 
            FROM subcategories s
            LEFT JOIN categories c ON s.category_id = c.id 
            WHERE s.id = ?
        `, [id], callback);
    },

    getByCategoryId: (categoryId, callback) => {
        db.query(`
            SELECT * FROM subcategories 
            WHERE category_id = ? 
            ORDER BY name ASC
        `, [categoryId], callback);
    },

    create: (data, callback) => {
        const sql = "INSERT INTO subcategories (category_id, name, slug) VALUES (?, ?, ?)";
        db.query(sql, [data.category_id || null, data.name, data.slug || null], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE subcategories SET category_id = COALESCE(?, category_id), name = COALESCE(?, name), slug = COALESCE(?, slug) WHERE id = ?";
        db.query(sql, [data.category_id, data.name, data.slug, id], callback);
    },

    delete: (id, callback) => {
        db.query("DELETE FROM subcategories WHERE id = ?", [id], callback);
    }
};

module.exports = Subcategory;
