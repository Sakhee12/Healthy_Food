const db = require("./config/db");
db.query("DESCRIBE categories", (err, result) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.table(result);
    process.exit(0);
});
