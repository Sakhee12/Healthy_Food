// Version: 1.0.1 - Clean
const Product = require("../models/productModel");

// Get all products with filters
exports.getAllProducts = (req, res) => {
    Product.getAll(req.query, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        const limit = parseInt(req.query.limit) || 12;
        res.json({
            page: parseInt(req.query.page) || 1,
            limit: limit,
            totalProducts: result.total,
            totalPages: Math.ceil(result.total / limit),
            products: result.products
        });
    });
};

// Get featured products
exports.getFeaturedProducts = (req, res) => {
    Product.getAll({ is_featured: 1, limit: 20 }, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(result.products);
    });
};

// Get trending products
exports.getTrendingProducts = (req, res) => {
    Product.getAll({ is_trending: 1, limit: 20 }, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json(result.products);
    });
};

// Add a new product
exports.addProduct = (req, res) => {
    const data = req.body;

    // Handle multiple images from upload.fields
    if (req.files) {
        if (req.files.product_image_file) data.product_image = `/uploads/${req.files.product_image_file[0].filename}`;
        if (req.files.image2_file) data.image2 = `/uploads/${req.files.image2_file[0].filename}`;
        if (req.files.image3_file) data.image3 = `/uploads/${req.files.image3_file[0].filename}`;
    }

    Product.create(data, (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            return res.status(500).json({ message: "DB error", error: err });
        }
        res.json({ message: "Product added successfully", id: result.insertId });
    });
};

// Update product
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // Handle multiple images from upload.fields
    if (req.files) {
        if (req.files.product_image_file) data.product_image = `/uploads/${req.files.product_image_file[0].filename}`;
        if (req.files.image2_file) data.image2 = `/uploads/${req.files.image2_file[0].filename}`;
        if (req.files.image3_file) data.image3 = `/uploads/${req.files.image3_file[0].filename}`;
    }

    Product.update(id, data, (err, result) => {
        if (err) return res.status(500).json({ message: "DB error", error: err });
        res.json({ message: "Product updated successfully" });
    });
};

// Delete product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    Product.delete(id, (err, result) => {
        if (err) {
            console.error("Backend: Delete error:", err);
            return res.status(500).json({ message: "DB error", error: err });
        }
        res.json({ message: "Product deleted successfully" });
    });
};
