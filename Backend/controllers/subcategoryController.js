const Subcategory = require("../models/subcategoryModel");

exports.getAllSubcategories = (req, res) => {
    Subcategory.getAll((err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching subcategories" });
        res.json(results);
    });
};

exports.getSubcategoryById = (req, res) => {
    Subcategory.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching subcategory" });
        if (results.length === 0) return res.status(404).json({ message: "Subcategory not found" });
        res.json(results[0]);
    });
};

exports.getSubcategoriesByCategory = (req, res) => {
    Subcategory.getByCategoryId(req.params.categoryId, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching subcategories" });
        res.json(results);
    });
};

exports.createSubcategory = (req, res) => {
    const { category_id, name, slug } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    Subcategory.create({ category_id, name, slug }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error creating subcategory" });
        res.status(201).json({ message: "Subcategory created successfully", id: result.insertId });
    });
};

exports.updateSubcategory = (req, res) => {
    const { category_id, name, slug } = req.body;

    Subcategory.update(req.params.id, { category_id, name, slug }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating subcategory" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Subcategory not found" });
        res.json({ message: "Subcategory updated successfully" });
    });
};

exports.deleteSubcategory = (req, res) => {
    Subcategory.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting subcategory" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Subcategory not found" });
        res.json({ message: "Subcategory deleted successfully" });
    });
};
