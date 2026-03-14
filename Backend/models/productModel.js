const db = require("../config/db");

const Product = {
    // Create product
    create: (data, callback) => {
        const sql = `
            INSERT INTO products (
                product_name, category_id, product_description, brand, 
                price, discount_price, stock, unit, 
                product_image, image2, image3, 
                rating, review_count, is_featured, is_trending, expiry_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [
            data.product_name,
            (data.category_id && data.category_id !== "") ? data.category_id : null,
            data.product_description || null,
            data.brand || null,
            data.price || 0.00,
            data.discount_price || 0.00,
            data.stock || 0,
            data.unit || null,
            data.product_image || null,
            data.image2 || null,
            data.image3 || null,
            data.rating || 0.0,
            data.review_count || 0,
            data.is_featured || 0,
            data.is_trending || 0,
            data.expiry_date || null
        ], callback);
    },

    // Get all products with advanced filtering, sorting, and pagination
    getAll: (filters, callback) => {
        let {
            category,
            minPrice,
            maxPrice,
            brand,
            rating,
            search,
            sort,
            page = 1,
            limit = 12
        } = filters;

        let offset = (parseInt(page) - 1) * parseInt(limit);

        let sql = `
            SELECT p.*, c.category_name,
            ROUND(CASE WHEN p.price > 0 THEN ((p.price - p.discount_price) / p.price * 100) ELSE 0 END) AS discount_percent
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
        `;
        const values = [];
        let conditions = [];

        if (category) {
            conditions.push("p.category_id = ?");
            values.push(category);
        }

        if (brand) {
            conditions.push("p.brand = ?");
            values.push(brand);
        }

        if (minPrice) {
            conditions.push("p.price >= ?");
            values.push(minPrice);
        }

        if (maxPrice) {
            conditions.push("p.price <= ?");
            values.push(maxPrice);
        }

        if (rating) {
            conditions.push("p.rating >= ?");
            values.push(rating);
        }

        if (search) {
            conditions.push("p.product_name LIKE ?");
            values.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        // Sorting
        if (sort === "price_asc") {
            sql += " ORDER BY p.price ASC";
        } else if (sort === "price_desc") {
            sql += " ORDER BY p.price DESC";
        } else if (sort === "rating") {
            sql += " ORDER BY p.rating DESC";
        } else if (sort === "newest") {
            sql += " ORDER BY p.created_at DESC";
        } else if (sort === "discount") {
            sql += " ORDER BY (p.price - p.discount_price) DESC";
        } else {
            sql += " ORDER BY p.id DESC"; // Default
        }

        // Pagination
        sql += " LIMIT ? OFFSET ?";
        values.push(parseInt(limit), offset);

        // Count query
        let countSql = "SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id";
        if (conditions.length > 0) {
            countSql += " WHERE " + conditions.join(" AND ");
        }

        db.query(sql, values, (err, products) => {
            if (err) return callback(err);
            db.query(countSql, values.slice(0, -2), (err, countResult) => {
                if (err) return callback(err);
                callback(null, {
                    products: products,
                    total: countResult[0].total
                });
            });
        });
    },

    // Update product (dynamic)
    update: (id, data, callback) => {
        const fields = [];
        const values = [];

        const updatableFields = [
            'product_name', 'category_id', 'product_description', 'brand',
            'price', 'discount_price', 'stock', 'unit',
            'product_image', 'image2', 'image3',
            'rating', 'review_count', 'is_featured', 'is_trending', 'expiry_date',
            'subcategory_id', 'brand_id'
        ];

        updatableFields.forEach(field => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                values.push(data[field]);
            }
        });

        if (fields.length === 0) return callback(null, { message: "No fields to update" });

        const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);
        db.query(sql, values, callback);
    },

    // Delete product
    delete: (id, callback) => {
        db.query("DELETE FROM products WHERE id = ?", [id], callback);
    }
};

module.exports = Product;
