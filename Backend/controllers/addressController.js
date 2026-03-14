const Address = require("../models/addressModel");

exports.getAddressesByUser = (req, res) => {
    // Ideally user_id comes from req.user (JWT), for now using params/body
    const userId = req.params.userId || req.body.user_id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    Address.getAllByUserId(userId, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching addresses" });
        res.json(results);
    });
};

exports.getAddressById = (req, res) => {
    Address.getById(req.params.id, (err, results) => {
        if (err) return res.status(500).json({ message: "Error fetching address" });
        if (results.length === 0) return res.status(404).json({ message: "Address not found" });
        res.json(results[0]);
    });
};

exports.createAddress = (req, res) => {
    const { user_id, address_line, city, state, pincode, latitude, longitude } = req.body;
    if (!user_id || !address_line) {
        return res.status(400).json({ message: "User ID and Address Line are required" });
    }

    Address.create({ user_id, address_line, city, state, pincode, latitude, longitude }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error creating address" });
        res.status(201).json({ message: "Address created successfully", id: result.insertId });
    });
};

exports.updateAddress = (req, res) => {
    const { address_line, city, state, pincode, latitude, longitude } = req.body;

    Address.update(req.params.id, { address_line, city, state, pincode, latitude, longitude }, (err, result) => {
        if (err) return res.status(500).json({ message: "Error updating address" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Address not found" });
        res.json({ message: "Address updated successfully" });
    });
};

exports.deleteAddress = (req, res) => {
    Address.delete(req.params.id, (err, result) => {
        if (err) return res.status(500).json({ message: "Error deleting address" });
        if (result.affectedRows === 0) return res.status(404).json({ message: "Address not found" });
        res.json({ message: "Address deleted successfully" });
    });
};
