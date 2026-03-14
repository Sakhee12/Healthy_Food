const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Use userId param or pass in body
router.get("/user/:userId", addressController.getAddressesByUser);
router.get("/:id", addressController.getAddressById);
router.post("/", addressController.createAddress);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
