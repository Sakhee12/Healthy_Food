const db = require('./Backend/config/db');
db.query('SELECT * FROM roles', (err, results) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(JSON.stringify(results, null, 2));
    db.end(() => process.exit(0));
});
