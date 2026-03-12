const db = require("../config/db");

const User = {
  create: (data, callback) => {
    // If we have role_name but not role_id, we need to handle it or default to customer (ID 6)
    // Defaulting to 6 (customer) if role_id is not provided
    db.query(
      "INSERT INTO users (name, email, phone, password, role_id) VALUES (?, ?, ?, ?, ?)",
      [
        data.name,
        data.email,
        data.phone,
        data.password,
        data.role_id || 6, // 6 is customer in our seed
      ],
      callback,
    );
  },
  findByEmail: (email, callback) => {
    db.query(
      `SELECT u.*, r.role_name as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email=?`,
      [email],
      callback
    );
  },
  findByPhone: (phone, callback) => {
    db.query(
      `SELECT u.*, r.role_name as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.phone=?`,
      [phone],
      callback
    );
  },
  findById: (id, callback) => {
    db.query(
      `SELECT u.*, r.role_name as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id=?`,
      [id],
      callback
    );
  },
  getAll: (callback) => {
    db.query(
      `SELECT u.*, r.role_name as role 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id`,
      callback
    );
  },
};

module.exports = User;
