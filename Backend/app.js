require("dotenv").config();
const express = require("express");
const cors = require("cors");

const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Existing Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const sectionRoutes = require("./routes/sectionRoutes");

// New Ecommerce Extension Routes
const brandRoutes = require("./routes/brandRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const variantRoutes = require("./routes/variantRoutes");
const addressRoutes = require("./routes/addressRoutes");
const catalogSectionRoutes = require("./routes/catalogSectionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api", sectionRoutes); // Legacy: /api/sections & /api/sections/:id/products

// New Routes Registration
app.use("/api/brands", brandRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/product-variants", variantRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/catalog/sections", catalogSectionRoutes);

// Global Debug Middleware for Multer
// ... (omitting log lines)
app.use((req, res, next) => {
// ...
});

// Global Error Handler
app.use((err, req, res, next) => {
// ...
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT} 🚀`);

    // AUTO MIGRATION BLOCK
    const db = require("./config/db");
    console.log('--- Checking Database Schema ---');
    try {
        // 1. Rename 'name' to 'category_name' if it exists
        const [cols] = await db.promise().query("DESCRIBE categories");
        const hasName = cols.some(c => c.Field === 'name');
        const hasCategoryName = cols.some(c => c.Field === 'category_name');
        const hasImageUrl = cols.some(c => c.Field === 'image_url');
        const hasCategoryImage = cols.some(c => c.Field === 'category_image');
        const hasBannerImage = cols.some(c => c.Field === 'banner_image');
        const hasDisplayOrder = cols.some(c => c.Field === 'display_order');
        const hasCreatedBy = cols.some(c => c.Field === 'created_by');

        let alterQueries = [];

        if (hasName && !hasCategoryName) {
            alterQueries.push("CHANGE COLUMN name category_name VARCHAR(255) NOT NULL");
        }
        if (hasImageUrl && !hasCategoryImage) {
            alterQueries.push("CHANGE COLUMN image_url category_image VARCHAR(255)");
        }
        if (!hasBannerImage) {
            alterQueries.push("ADD COLUMN banner_image VARCHAR(255) AFTER category_image");
        }
        if (!hasDisplayOrder) {
            alterQueries.push("ADD COLUMN display_order INT DEFAULT 0 AFTER parent_id");
        }
        if (!hasCreatedBy) {
            alterQueries.push("ADD COLUMN created_by INT AFTER status");
        }

        if (alterQueries.length > 0) {
            console.log('Migrating database schema...');
            await db.promise().query(`ALTER TABLE categories ${alterQueries.join(', ')}`);
            console.log('Database migrated successfully! ✅');
        }

        // 2. Roles and Users Migration
        console.log('--- Checking RBAC Schema ---');
        // Create roles table
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                role_name VARCHAR(50) UNIQUE NOT NULL
            )
        `);

        // Seed roles if empty
        const [roleRows] = await db.promise().query("SELECT COUNT(*) as count FROM roles");
        if (roleRows[0].count === 0) {
            console.log('Seeding roles table...');
            await db.promise().query(`
                INSERT INTO roles (id, role_name) VALUES 
                (1, 'superadmin'), 
                (2, 'admin'), 
                (3, 'manager'), 
                (4, 'inventory_manager'), 
                (5, 'delivery_boy'), 
                (6, 'customer')
            `);
        }

        // Update users table
        const [userCols] = await db.promise().query("DESCRIBE users");
        const hasRoleId = userCols.some(c => c.Field === 'role_id');
        const hasStatus = userCols.some(c => c.Field === 'status');
        const hasRoleCol = userCols.some(c => c.Field === 'role');

        let userAlterQueries = [];
        if (!hasRoleId) {
            userAlterQueries.push("ADD COLUMN role_id INT DEFAULT 6 AFTER password");
        }
        if (!hasStatus) {
            userAlterQueries.push("ADD COLUMN status TINYINT DEFAULT 1 AFTER role_id");
        }

        if (userAlterQueries.length > 0) {
            console.log('Migrating users table for RBAC...');
            await db.promise().query(`ALTER TABLE users ${userAlterQueries.join(', ')}`);
        }

        // Optional: migrate existing string roles to role_id if 'role' column exists
        if (hasRoleCol && hasRoleId) {
            console.log('Migrating legacy role strings to role_id...');
            await db.promise().query("UPDATE users SET role_id = 1 WHERE role = 'superadmin' OR role = 'Super Admin'");
            await db.promise().query("UPDATE users SET role_id = 2 WHERE role = 'admin' OR role = 'Admin'");
            await db.promise().query("UPDATE users SET role_id = 3 WHERE role = 'manager' OR role = 'Manager'");
            await db.promise().query("UPDATE users SET role_id = 4 WHERE role = 'inventory_manager' OR role = 'Inventory Manager'");
            await db.promise().query("UPDATE users SET role_id = 5 WHERE role = 'delivery_boy' OR role = 'Delivery Boy'");
            await db.promise().query("UPDATE users SET role_id = 6 WHERE role = 'customer' OR role = 'Customer' OR role = 'User'");
            // We keep the 'role' column for safety, or you could drop it later.
        }

        // 3. Cart Schema Migration
        console.log('--- Checking Cart Schema ---');
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS carts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total_items INT DEFAULT 0,
                total_price DECIMAL(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cart_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT DEFAULT 1,
                price DECIMAL(10,2) NOT NULL,
                total_price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);

        console.log('Database schema for Cart is up to date. ✅');
    } catch (err) {
        console.error('Database Auto-Migration failed! ❌');
        console.error(err.message);
        // We don't exit here to allow the server to keep running even if migration has minor issues
    }
});
