require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');


async function seed() {
    const password = await bcrypt.hash('Healthy@123', 10);

    const users = [
        { name: 'Super Admin', email: 'superadmin@healthyfood.com', phone: '1234567890', password, role_id: 1 },
        { name: 'Admin', email: 'admin@healthyfood.com', phone: '1234567891', password, role_id: 2 },
        { name: 'Manager', email: 'manager@healthyfood.com', phone: '1234567892', password, role_id: 3 },
        { name: 'Delivery Boy', email: 'delivery@healthyfood.com', phone: '1234567893', password, role_id: 5 },
        { name: 'Customer', email: 'customer@healthyfood.com', phone: '1234567894', password, role_id: 6 },
    ];

    console.log('Seeding test users...');

    for (const user of users) {
        try {
            // Check if user exists
            const [existing] = await db.promise().query('SELECT id FROM users WHERE email = ?', [user.email]);

            if (existing.length > 0) {
                console.log(`User ${user.email} already exists. Updating...`);
                await db.promise().query(
                    'UPDATE users SET name = ?, phone = ?, password = ?, role_id = ? WHERE email = ?',
                    [user.name, user.phone, user.password, user.role_id, user.email]
                );
            } else {
                console.log(`Creating user ${user.email}...`);
                await db.promise().query(
                    'INSERT INTO users (name, email, phone, password, role_id) VALUES (?, ?, ?, ?, ?)',
                    [user.name, user.email, user.phone, user.password, user.role_id]
                );
            }
        } catch (err) {
            console.error(`Error processing ${user.email}:`, err.message);
        }
    }

    console.log('Seeding completed! ✅');
    db.end(() => process.exit(0));
}

seed();
