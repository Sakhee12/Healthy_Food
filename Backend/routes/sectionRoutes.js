const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");

router.get("/sections", sectionController.getSections);
router.get("/sections/:id/products", sectionController.getSectionProducts);

module.exports = router;
