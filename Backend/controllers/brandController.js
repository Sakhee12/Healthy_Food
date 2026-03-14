const Brand = require("../models/brandModel");

exports.getAllBrands = (req, res) => {
    Brand.getAll((err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching brands" });
        res.json(results);
    });
};

exports.getBrandById = (req, res) => {
    Brand.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching brand" });
        if (results.length === 0) return res.status(404).json({ message: "Brand not found" });
        res.json(results[0]);
    });
};

exports.createBrand = (req, res) => {
    const { name, logo } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    Brand.create({ name, logo }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error creating brand" });
        res.status(201).json({ message: "Brand created successfully", id: result.insertId });
    });
};

exports.updateBrand = (req, res) => {
    const { name, logo } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    Brand.update(req.params.id, { name, logo }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating brand" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Brand not found" });
        res.json({ message: "Brand updated successfully" });
    });
};

exports.deleteBrand = (req, res) => {
    Brand.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting brand" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Brand not found" });
        res.json({ message: "Brand deleted successfully" });
    });
};
