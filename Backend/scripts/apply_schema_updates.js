const db = require('../config/db');

const sqlCreateTables = [
    // 2. user_addresses
    `CREATE TABLE IF NOT EXISTS user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        address_line VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8)
    )`,
    // 3. otp_verifications
    `CREATE TABLE IF NOT EXISTS otp_verifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phone VARCHAR(20),
        otp INT,
        expires_at DATETIME
    )`,
    // 4. admins
    `CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
    )`,
    // 5. admin_roles
    `CREATE TABLE IF NOT EXISTS admin_roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_name VARCHAR(100) UNIQUE
    )`,
    // 6. admin_permissions
    `CREATE TABLE IF NOT EXISTS admin_permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id INT,
        permission VARCHAR(255)
    )`,
    // 7. sections
    `CREATE TABLE IF NOT EXISTS sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        slug VARCHAR(255) UNIQUE,
        image VARCHAR(255),
        status BOOLEAN DEFAULT 1
    )`,
    // 9. subcategories
    `CREATE TABLE IF NOT EXISTS subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT,
        name VARCHAR(255),
        slug VARCHAR(255) UNIQUE
    )`,
    // 11. product_images
    `CREATE TABLE IF NOT EXISTS product_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        image_url VARCHAR(255)
    )`,
    // 12. brands
    `CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        logo VARCHAR(255)
    )`,
    // 13. product_variants
    `CREATE TABLE IF NOT EXISTS product_variants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        variant_name VARCHAR(255),
        price DECIMAL(10,2),
        stock INT DEFAULT 0
    )`
];

async function columnExists(connection, tableName, columnName) {
    const [rows] = await connection.query(`
        SELECT COUNT(*) as count 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE table_schema = DATABASE() 
        AND table_name = ? 
        AND column_name = ?
    `, [tableName, columnName]);
    return rows[0].count > 0;
}

async function runMigration() {
    console.log('Starting migration...');
    
    const connection = db.promise();
    
    try {
        for (let i = 0; i < sqlCreateTables.length; i++) {
            const sql = sqlCreateTables[i];
            console.log(`Creating table ${i + 1}/${sqlCreateTables.length}...`);
            await connection.query(sql);
        }

        // Alter categories
        if (!(await columnExists(connection, 'categories', 'section_id'))) {
            console.log('Adding section_id to categories...');
            await connection.query('ALTER TABLE categories ADD section_id INT DEFAULT NULL');
        } else {
            console.log('section_id already exists in categories');
        }

        // Alter products
        if (!(await columnExists(connection, 'products', 'subcategory_id'))) {
            console.log('Adding subcategory_id to products...');
            await connection.query('ALTER TABLE products ADD subcategory_id INT DEFAULT NULL');
        } else {
            console.log('subcategory_id already exists in products');
        }

        if (!(await columnExists(connection, 'products', 'brand_id'))) {
            console.log('Adding brand_id to products...');
            await connection.query('ALTER TABLE products ADD brand_id INT DEFAULT NULL');
        } else {
            console.log('brand_id already exists in products');
        }

        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        process.exit(0);
    }
}

runMigration();
