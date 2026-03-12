const db = require('../config/db');

const queries = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(30) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE IF NOT EXISTS otp_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(30),
    otp VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100),
    description TEXT,
    image_url VARCHAR(255),
    parent_id INT,
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB;`,

  `DROP TABLE IF EXISTS products;`,

  `CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    product_name VARCHAR(200),
    product_description TEXT,
    brand VARCHAR(100),
    
    price DECIMAL(10,2),
    discount_price DECIMAL(10,2),
    
    stock INT,
    unit VARCHAR(50),
    
    product_image VARCHAR(255),
    image2 VARCHAR(255),
    image3 VARCHAR(255),
    
    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    
    is_featured BOOLEAN DEFAULT 0,
    is_trending BOOLEAN DEFAULT 0,
    
    expiry_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  ) ENGINE=InnoDB;`,
];

let i = 0;
function runNext() {
  if (i >= queries.length) {
    console.log('All tables ensured.');
    db.end();
    return;
  }

  db.query(queries[i], (err, result) => {
    if (err) {
      console.error('Error running query:', err);
      db.end();
      process.exit(1);
    }
    console.log('Query executed successfully');
    i += 1;
    runNext();
  });
}

runNext();
