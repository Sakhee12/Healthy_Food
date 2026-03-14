const db = require("../config/db");

const Address = {
    getAllByUserId: (userId, callback) => {
        db.query("SELECT * FROM user_addresses WHERE user_id = ? ORDER BY id DESC", [userId], callback);
    },

    getById: (id, callback) => {
        db.query("SELECT * FROM user_addresses WHERE id = ?", [id], callback);
    },

    create: (data, callback) => {
        const sql = `
            INSERT INTO user_addresses (
                user_id, address_line, city, state, pincode, latitude, longitude
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [
            data.user_id,
            data.address_line,
            data.city || null,
            data.state || null,
            data.pincode || null,
            data.latitude || null,
            data.longitude || null
        ], callback);
    },

    update: (id, data, callback) => {
        const sql = `
            UPDATE user_addresses SET 
                address_line = COALESCE(?, address_line), 
                city = COALESCE(?, city), 
                state = COALESCE(?, state), 
                pincode = COALESCE(?, pincode), 
                latitude = COALESCE(?, latitude), 
                longitude = COALESCE(?, longitude)
            WHERE id = ?
        `;
        db.query(sql, [
            data.address_line,
            data.city,
            data.state,
            data.pincode,
            data.latitude,
            data.longitude,
            id
        ], callback);
    },

    delete: (id, callback) => {
        db.query("DELETE FROM user_addresses WHERE id = ?", [id], callback);
    }
};

module.exports = Address;
