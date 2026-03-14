const CatalogSection = require("../models/catalogSectionModel");

exports.getAllSections = (req, res) => {
    CatalogSection.getAll((err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching sections" });
        res.json(results);
    });
};

exports.getSectionById = (req, res) => {
    CatalogSection.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching section" });
        if (results.length === 0) return res.status(404).json({ message: "Section not found" });
        res.json(results[0]);
    });
};

exports.createSection = (req, res) => {
    const { name, slug, image, status } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    CatalogSection.create({ name, slug, image, status }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error creating section" });
        res.status(201).json({ message: "Section created successfully", id: result.insertId });
    });
};

exports.updateSection = (req, res) => {
    const { name, slug, image, status } = req.body;

    CatalogSection.update(req.params.id, { name, slug, image, status }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating section" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Section not found" });
        res.json({ message: "Section updated successfully" });
    });
};

exports.deleteSection = (req, res) => {
    CatalogSection.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting section" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Section not found" });
        res.json({ message: "Section deleted successfully" });
    });
};
