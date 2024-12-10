// server.js
console.log('Server file is being executed...');

const express = require('express');
const bcrypt = require('bcrypt');
const dbAccess = require('./db.js');
const db = dbAccess.db;

const app = express();
const port = 1911;

app.use(express.json());

// User Registration (Customer)
app.post('/user/register', (req, res) => {
    const { email, password } = req.body;

    if (password.length < 8) {
        return res.status(400).send('Password must be at least 8 characters long');
    }

    bcrypt.hash(password, 8, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error hashing password');
        }

        const query = `INSERT INTO USERS (EMAIL, PASSWORD, ROLE) VALUES (?, ?, 'customer')`;
        db.run(query, [email, hashedPassword], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error saving user');
            }
            res.status(200).send('Registration successful');
        });
    });
});

// User Login
app.post('/user/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM USERS WHERE EMAIL = ?`, [email], (err, user) => {
        if (err || !user) {
            return res.status(401).send('Invalid email or password');
        }

        bcrypt.compare(password, user.PASSWORD, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send('Invalid email or password');
            }

            res.status(200).send(`Login successful as ${user.ROLE}`);
        });
    });
});

// Guest and Customer: View Products
app.get('/products', (req, res) => {
    const query = `SELECT * FROM PRODUCT WHERE QUANTITY > 0`;
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching products');
        }
        res.status(200).json(rows);
    });
});

// Customer: Add Products to Cart
app.post('/cart/add', (req, res) => {
    const { userId, productId, quantity } = req.body;

    const query = `INSERT INTO CART (USER_ID, PRODUCT_ID, QUANTITY) VALUES (?, ?, ?)`;
    db.run(query, [userId, productId, quantity], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding product to cart');
        }
        res.status(200).send('Product added to cart successfully');
    });
});

// Customer: View Cart
app.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `SELECT * FROM CART WHERE USER_ID = ?`;
    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching cart items');
        }
        res.status(200).json(rows);
    });
});

// Customer: Place Order
app.post('/order/place', (req, res) => {
    const { userId, name, address, paymentMethod } = req.body;

    const cartQuery = `SELECT * FROM CART WHERE USER_ID = ?`;
    db.all(cartQuery, [userId], (err, cartItems) => {
        if (err || !cartItems.length) {
            return res.status(500).send('Error retrieving cart or cart is empty');
        }

        cartItems.forEach((item) => {
            const productQuery = `SELECT PRICE FROM PRODUCT WHERE ID = ?`;
            db.get(productQuery, [item.PRODUCT_ID], (err, product) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error retrieving product price');
                }

                const totalPrice = product.PRICE * item.QUANTITY;
                const orderQuery = `
                    INSERT INTO ORDERS (USER_ID, PRODUCT_ID, QUANTITY, TOTAL_PRICE, NAME, ADDRESS, PAYMENT_METHOD)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                db.run(orderQuery, [userId, item.PRODUCT_ID, item.QUANTITY, totalPrice, name, address, paymentMethod], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error placing order');
                    }
                });
            });
        });

        const clearCartQuery = `DELETE FROM CART WHERE USER_ID = ?`;
        db.run(clearCartQuery, [userId], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error clearing cart');
            }
            res.status(200).send('Order placed successfully');
        });
    });
});

// Admin: Add Products
app.post('/admin/products/add', (req, res) => {
    const { name, description, price, quantity } = req.body;

    const query = `INSERT INTO PRODUCT (NAME, DESCRIPTION, PRICE, QUANTITY) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, description, parseFloat(price), parseInt(quantity, 10)], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding product');
        }
        res.status(200).send('Product added successfully');
    });
});

// Start Server
app.listen(port, async () => {
    console.log(`App started at port ${port}`);

    try {
        // Ensure tables are created when the server starts
        if (typeof dbAccess.createTables === 'function') {
            await dbAccess.createTables();
            console.log('Database tables ensured.');
        } else {
            console.error("Error: 'createTables' is not defined in db.js");
        }
    } catch (err) {
        console.error('Error during table creation:', err);
    }
});
