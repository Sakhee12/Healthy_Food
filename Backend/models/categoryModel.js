const db = require("../config/db");

const Category = {
    // Create category
    create: (data, callback) => {
        const sql = `
            INSERT INTO categories (
                category_name, slug, description, category_image, 
                banner_image, parent_id, display_order, status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [
            data.category_name,
            data.slug || null,
            data.description || null,
            data.category_image || null,
            data.banner_image || null,
            data.parent_id || null,
            data.display_order || 0,
            data.status !== undefined ? data.status : 1,
            data.created_by || null
        ], callback);
    },

    // Get all categories with optional filtering
    getAll: (filters, callback) => {
        let sql = "SELECT * FROM categories";
        const queryParams = [];
        const whereClauses = [];

        if (filters) {
            if (filters.category_name || filters.name) {
                whereClauses.push("category_name LIKE ?");
                queryParams.push(`%${filters.category_name || filters.name}%`);
            }
            if (filters.status !== undefined && filters.status !== '') {
                whereClauses.push("status = ?");
                queryParams.push(filters.status);
            }
            if (filters.parent_id !== undefined && filters.parent_id !== '') {
                whereClauses.push("parent_id = ?");
                queryParams.push(filters.parent_id);
            }
        }

        if (whereClauses.length > 0) {
            sql += " WHERE " + whereClauses.join(" AND ");
        }

        sql += " ORDER BY display_order ASC, created_at DESC";

        db.query(sql, queryParams, callback);
    },

    // Update category (dynamic)
    update: (id, data, callback) => {
        const fields = [];
        const values = [];

        const updatableFields = [
            'category_name', 'slug', 'description', 'category_image',
            'banner_image', 'parent_id', 'display_order', 'status', 'section_id'
        ];

        updatableFields.forEach(field => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (fields.length === 0) return callback(null, { message: "No fields to update" });

        const sql = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        db.query(sql, values, callback);
    },

    // Delete category
    delete: (id, callback) => {
        db.query("DELETE FROM categories WHERE id = ?", [id], callback);
    },

    // Get categories as a tree (Main -> Subcategories)
    getTree: (callback) => {
        const sql = "SELECT * FROM categories ORDER BY display_order ASC";
        db.query(sql, (err, rows) => {
            if (err) return callback(err);

            // Build tree structure
            const categoryMap = {};
            const tree = [];

            // First pass: Map all categories
            rows.forEach(row => {
                categoryMap[row.id] = { ...row, subcategories: [] };
            });

            // Second pass: Populate subcategories or root
            rows.forEach(row => {
                if (row.parent_id && categoryMap[row.parent_id]) {
                    categoryMap[row.parent_id].subcategories.push(categoryMap[row.id]);
                } else {
                    tree.push(categoryMap[row.id]);
                }
            });

            callback(null, tree);
        });
    }
};

module.exports = Category;
