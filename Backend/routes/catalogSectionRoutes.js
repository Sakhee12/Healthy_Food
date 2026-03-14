const express = require("express");
const router = express.Router();
const catalogSectionController = require("../controllers/catalogSectionController");

router.get("/", catalogSectionController.getAllSections);
router.get("/:id", catalogSectionController.getSectionById);
router.post("/", catalogSectionController.createSection);
router.put("/:id", catalogSectionController.updateSection);
router.delete("/:id", catalogSectionController.deleteSection);

module.exports = router;
