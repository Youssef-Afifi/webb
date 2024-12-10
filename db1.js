const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('laptops.db'); // Ensure the path is correct for persistent DB

// Table creation queries
const createUserTable = `
CREATE TABLE IF NOT EXISTS USERS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT NOT NULL,
    EMAIL TEXT UNIQUE NOT NULL,
    PASSWORD TEXT NOT NULL,
    ROLE TEXT NOT NULL
);`;

const createProductTable = `
CREATE TABLE IF NOT EXISTS PRODUCT (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME TEXT NOT NULL,
    DESCRIPTION TEXT,
    PRICE REAL NOT NULL,
    QUANTITY INTEGER NOT NULL
);`;

const createCartTable = `
CREATE TABLE IF NOT EXISTS CART (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID INTEGER NOT NULL,
    PRODUCT_ID INTEGER NOT NULL,
    QUANTITY INTEGER NOT NULL,
    FOREIGN KEY(USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY(PRODUCT_ID) REFERENCES PRODUCT(ID)
);`;

const createOrdersTable = `
CREATE TABLE IF NOT EXISTS ORDERS (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID INTEGER NOT NULL,
    PRODUCT_ID INTEGER NOT NULL,
    QUANTITY INTEGER NOT NULL,
    TOTAL_PRICE REAL NOT NULL,
    NAME TEXT NOT NULL,
    ADDRESS TEXT NOT NULL,
    PAYMENT_METHOD TEXT NOT NULL,
    FOREIGN KEY(USER_ID) REFERENCES USERS(ID),
    FOREIGN KEY(PRODUCT_ID) REFERENCES PRODUCT(ID)
);`;

// Function to create all tables
function createTables() {
    db.serialize(() => {
        // Create USERS table
        db.run(createUserTable, (err) => {
            if (err) {
                console.error("Error creating USERS table:", err.message);
            } else {
                console.log("USERS table created or already exists.");
            }
        });

        // Create PRODUCT table
        db.run(createProductTable, (err) => {
            if (err) {
                console.error("Error creating PRODUCT table:", err.message);
            } else {
                console.log("PRODUCT table created or already exists.");
            }
        });

        // Create CART table
        db.run(createCartTable, (err) => {
            if (err) {
                console.error("Error creating CART table:", err.message);
            } else {
                console.log("CART table created or already exists.");
            }
        });

        // Create ORDERS table
        db.run(createOrdersTable, (err) => {
            if (err) {
                console.error("Error creating ORDERS table:", err.message);
            } else {
                console.log("ORDERS table created or already exists.");
            }
        });
    });
}

// Exporting the database instance and table creation functions
module.exports = {
    db,
    createUserTable,
    createProductTable,
    createCartTable,
    createOrdersTable,
    createTables
};
