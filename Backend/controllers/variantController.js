const Variant = require("../models/variantModel");

exports.getAllVariants = (req, res) => {
    Variant.getAll((err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching variants" });
        res.json(results);
    });
};

exports.getVariantById = (req, res) => {
    Variant.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching variant" });
        if (results.length === 0) return res.status(404).json({ message: "Variant not found" });
        res.json(results[0]);
    });
};

exports.getVariantsByProduct = (req, res) => {
    Variant.getByProductId(req.params.productId, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching variants" });
        res.json(results);
    });
};

exports.createVariant = (req, res) => {
    const { product_id, variant_name, price, stock } = req.body;
    if (!product_id || !variant_name || price === undefined) {
        return res.status(400).json({ message: "Product ID, variant name, and price are required" });
    }

    Variant.create({ product_id, variant_name, price, stock }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error creating variant" });
        res.status(201).json({ message: "Variant created successfully", id: result.insertId });
    });
};

exports.updateVariant = (req, res) => {
    const { product_id, variant_name, price, stock } = req.body;

    Variant.update(req.params.id, { product_id, variant_name, price, stock }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating variant" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Variant not found" });
        res.json({ message: "Variant updated successfully" });
    });
};

exports.deleteVariant = (req, res) => {
    Variant.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting variant" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Variant not found" });
        res.json({ message: "Variant deleted successfully" });
    });
};
