const db = require('./config/db');

db.query("SHOW TABLES", (err, tables) => {
    if (err) {
        console.error("Error showing tables:", err);
        process.exit(1);
    }
    
    if (tables.length === 0) {
        console.log("No tables found.");
        process.exit(0);
    }
    
    let dbName = Object.values(tables[0]).find(() => true);
    // actually, tables is array of objects like { 'Tables_in_healtlyfruit': 'categories' }
    let tableNames = tables.map(t => Object.values(t)[0]);
    
    let promises = tableNames.map(tableName => {
        return new Promise((resolve, reject) => {
            db.query(`DESCRIBE !!tableName!!`.replace('!!tableName!!', tableName), (err, desc) => {
                if (err) reject(err);
                resolve({ table: tableName, columns: desc });
            });
        });
    });

    Promise.all(promises).then(results => {
        results.forEach(res => {
            console.log(`\n--- Table: ${res.table} ---`);
            res.columns.forEach(col => {
                console.log(`${col.Field} (${col.Type}) ${col.Key ? `[${col.Key}]` : ''}`);
            });
        });
        process.exit(0);
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
});
