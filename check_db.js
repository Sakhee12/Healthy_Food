const db = require('./Backend/config/db');

db.query("DESCRIBE products", (err, results) => {
    if (err) {
        console.error("Error describing products:", err);
        process.exit(1);
    }
    console.log("Columns in 'products' table:");
    console.table(results.map(r => ({ Field: r.Field, Type: r.Type })));

    db.query("SELECT * FROM products LIMIT 1", (err, rows) => {
        if (err) {
            console.error("Error fetching a product:", err);
            process.exit(1);
        }
        if (rows.length > 0) {
            console.log("\nSample product data (first row keys):");
            console.log(Object.keys(rows[0]));
            console.log("\nSample product values:");
            console.log(rows[0]);
        } else {
            console.log("\nNo products found in the table.");
        }
        process.exit(0);
    });
});
