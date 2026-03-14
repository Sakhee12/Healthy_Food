const db = require("../config/db");

// Using a custom CatalogSection to separate from categories logic
const CatalogSection = {
    getAll: (callback) => {
        db.query("SELECT * FROM sections ORDER BY name ASC", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT * FROM sections WHERE id = ?", [id], callback);
    },

    create: (data, callback) => {
        const sql = "INSERT INTO sections (name, slug, image, status) VALUES (?, ?, ?, ?)";
        db.query(sql, [data.name, data.slug || null, data.image || null, data.status !== undefined ? data.status : 1], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE sections SET name = COALESCE(?, name), slug = COALESCE(?, slug), image = COALESCE(?, image), status = COALESCE(?, status) WHERE id = ?";
        db.query(sql, [data.name, data.slug, data.image, data.status, id], callback);
    },

    delete: (id, callback) => {
        db.query("DELETE FROM sections WHERE id = ?", [id], callback);
    }
};

module.exports = CatalogSection;
