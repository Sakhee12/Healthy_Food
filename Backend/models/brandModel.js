const db = require("../config/db");

const Brand = {
    getAll: (callback) => {
        db.query("SELECT * FROM brands ORDER BY name ASC", callback);
    },

    getById: (id, callback) => {
        db.query("SELECT * FROM brands WHERE id = ?", [id], callback);
    },

    create: (data, callback) => {
        const sql = "INSERT INTO brands (name, logo) VALUES (?, ?)";
        db.query(sql, [data.name, data.logo || null], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE brands SET name = ?, logo = COALESCE(?, logo) WHERE id = ?";
        db.query(sql, [data.name, data.logo, id], callback);
    },

    delete: (id, callback) => {
        db.query("DELETE FROM brands WHERE id = ?", [id], callback);
    }
};

module.exports = Brand;
