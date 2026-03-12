// Version: 1.0.1 - Clean
const User = require("../models/userModel");
const Category = require("../models/categoryModel");

// Get all users
exports.getAllUsers = (req, res) => {
    User.getAll((err, users) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(users);
    });
};

// Category Management
exports.getAllCategories = (req, res) => {
    const filters = req.query;
    Category.getAll(filters, (err, categories) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(categories);
    });
};

exports.addCategory = (req, res) => {
    const data = req.body;
    // Handle images from upload.fields
    if (req.files) {
        if (req.files.category_image_file) data.category_image = `/uploads/${req.files.category_image_file[0].filename}`;
        if (req.files.banner_image_file) data.banner_image = `/uploads/${req.files.banner_image_file[0].filename}`;
    }
    // Set creator ID if available (from adminMiddleware)
    if (req.user && req.user.id) {
        data.created_by = req.user.id;
    }

    Category.create(data, (err, result) => {
        if (err) {
            console.error("Category DB Error:", err);
            return res.status(500).json({ message: "DB error", error: err });
        }
        res.json({ message: "Category added successfully", id: result.insertId });
    });
};

exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    if (req.files) {
        if (req.files.category_image_file) data.category_image = `/uploads/${req.files.category_image_file[0].filename}`;
        if (req.files.banner_image_file) data.banner_image = `/uploads/${req.files.banner_image_file[0].filename}`;
    }

    Category.update(id, data, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Category updated successfully" });
    });
};

exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    Category.delete(id, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Category deleted successfully" });
    });
};

// Get all roles
exports.getRoles = (req, res) => {
    const db = require("../config/db");
    db.query("SELECT * FROM roles", (err, roles) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(roles);
    });
};

// Update user role
exports.updateUserRole = (req, res) => {
    const { id, role_id } = req.body;
    const db = require("../config/db");

    db.query(
        "UPDATE users SET role_id = ? WHERE id = ?",
        [role_id, id],
        (err, result) => {
            if (err) return res.status(500).json({ message: "DB error", error: err });
            res.json({ message: "User role updated successfully" });
        }
    );
};

// Delete user
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const db = require("../config/db");

    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "User deleted successfully" });
    });
};
