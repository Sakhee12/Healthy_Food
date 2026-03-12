require("dotenv").config();
const express = require("express");
const cors = require("cors");

const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");

app.use("/api/auth", authRoutes);

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

// Global Debug Middleware for Multer
app.use((req, res, next) => {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        console.log("--- DEBUG: Incoming Multipart Request ---");
        console.log("Path:", req.path);
        // Note: Field names can't be seen here easily without parsing, 
        // but we can catch the error specifically.
    }
    next();
});

// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof require('multer').MulterError) {
        console.error("MULTER ERROR DETAILS:", {
            code: err.code,
            field: err.field,
            message: err.message
        });
        require('fs').appendFileSync('multer_err.txt', `\n[${new Date().toISOString()}] MULTER ERROR: ${err.message} on field: ${err.field}`);
    }
    console.error("GLOBAL SERVER ERROR:", err.stack || err);
    require('fs').appendFileSync('global_err.txt', "\nERROR: " + (err.stack || err));
    res.status(500).json({ message: "Internal Server Error", error: err.message });
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

        console.log('Database RBAC schema is up to date. ✅');
    } catch (err) {
        console.error('Database Auto-Migration failed! ❌');
        console.error(err.message);
        // We don't exit here to allow the server to keep running even if migration has minor issues
    }
});
