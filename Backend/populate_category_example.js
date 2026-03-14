const db = require("./config/db");

async function populateExample() {
    // 1. Create Main Category
    const mainSql = "INSERT INTO categories (category_name, slug, parent_id, status) VALUES (?, ?, NULL, 1)";
    
    db.query(mainSql, ["Vegetables & Fruits", "vegetables-fruits"], (err, result) => {
        if (err) {
            console.error("Error adding main category:", err);
            process.exit(1);
        }
        
        const mainId = result.insertId;
        console.log(`Added Main Category: Vegetables & Fruits (ID: ${mainId})`);

        const subcategories = [
            ["All Fresh Vegetables", "all-fresh-vegetables"],
            ["Fresh Fruits", "fresh-fruits"],
            ["Exotics", "exotics"],
            ["Coriander & Others", "coriander-others"]
        ];

        let count = 0;
        subcategories.forEach(([name, slug]) => {
            const subSql = "INSERT INTO categories (category_name, slug, parent_id, status) VALUES (?, ?, ?, 1)";
            db.query(subSql, [name, slug, mainId], (err) => {
                if (err) console.error(`Error adding ${name}:`, err);
                else console.log(`Added Subcategory: ${name}`);
                
                count++;
                if (count === subcategories.length) {
                    console.log("Example data populated successfully!");
                    process.exit(0);
                }
            });
        });
    });
}

populateExample();
