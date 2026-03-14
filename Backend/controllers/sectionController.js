const db = require("../config/db");

exports.getSections = (req, res) => {
    const sql = `
        SELECT id, category_name, category_image, banner_image
        FROM categories
        WHERE parent_id IS NULL AND status = 1
        ORDER BY display_order ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching sections:", err);
            return res.status(500).json({ message: "Error fetching sections" });
        }
        res.json(results);
    });
};

exports.getSectionProducts = (req, res) => {
    const sectionId = req.params.id;

    const sql = `
        SELECT p.*, c.category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ?
        OR p.category_id IN (
            SELECT id FROM categories WHERE parent_id = ?
        )
        ORDER BY p.id DESC
    `;

    db.query(sql, [sectionId, sectionId], (err, results) => {
        if (err) {
            console.error("Error fetching section products:", err);
            return res.status(500).json({ message: "Error fetching products" });
        }
        res.json(results);
    });
};
