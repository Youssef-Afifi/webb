console.log('Server file is being executed...');

const express = require('express');
const bcrypt = require('bcrypt');
const dbAccess = require('./db1.js');
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
                if (err.message.includes("UNIQUE constraint failed")) {
                    return res.status(400).send('Email already registered');
                }
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

            res.status(200).json({ message: `Login successful`, userId: user.ID });
        });
    });
});

// Guest and Customer: View Products
app.get('/products', (req, res) => {
    const query = `SELECT * FROM PRODUCT WHERE QUANTITY > 0`;
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }
        res.status(200).json(rows);
    });
});

// Customer: Add or Update Products in Cart
app.post('/cart/add', (req, res) => {
    const { userId, productId, quantity } = req.body;

    const checkQuery = `SELECT * FROM CART WHERE USER_ID = ? AND PRODUCT_ID = ?`;
    db.get(checkQuery, [userId, productId], (err, row) => {
        if (err) {
            console.error('Error checking cart:', err);
            return res.status(500).send('Error checking cart');
        }

        if (row) {
            const updateQuery = `UPDATE CART SET QUANTITY = QUANTITY + ? WHERE USER_ID = ? AND PRODUCT_ID = ?`;
            db.run(updateQuery, [quantity, userId, productId], (err) => {
                if (err) {
                    console.error('Error updating cart:', err);
                    return res.status(500).send('Error updating cart');
                }
                res.status(200).send('Cart updated successfully');
            });
        } else {
            const insertQuery = `INSERT INTO CART (USER_ID, PRODUCT_ID, QUANTITY) VALUES (?, ?, ?)`;
            db.run(insertQuery, [userId, productId, quantity], (err) => {
                if (err) {
                    console.error('Error adding product to cart:', err);
                    return res.status(500).send('Error adding product to cart');
                }
                res.status(200).send('Product added to cart successfully');
            });
        }
    });
});

// Customer: View Cart
app.get('/cart/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT CART.PRODUCT_ID, CART.QUANTITY, PRODUCT.NAME, PRODUCT.PRICE 
        FROM CART
        JOIN PRODUCT ON CART.PRODUCT_ID = PRODUCT.ID
        WHERE CART.USER_ID = ?`;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).send('Error fetching cart items');
        }
        res.status(200).json(rows);
    });
});

// Customer: Place Order
app.post('/order/place', (req, res) => {
    const { userId, name, address, paymentMethod } = req.body;

    const cartQuery = `
        SELECT CART.PRODUCT_ID, CART.QUANTITY, PRODUCT.PRICE 
        FROM CART
        JOIN PRODUCT ON CART.PRODUCT_ID = PRODUCT.ID
        WHERE CART.USER_ID = ?`;

    db.all(cartQuery, [userId], (err, cartItems) => {
        if (err || !cartItems.length) {
            return res.status(400).send('Cart is empty or error retrieving cart');
        }

        const totalPrice = cartItems.reduce((sum, item) => sum + item.PRICE * item.QUANTITY, 0);

        const orderQuery = `
            INSERT INTO ORDERS (USER_ID, TOTAL_PRICE, NAME, ADDRESS, PAYMENT_METHOD) 
            VALUES (?, ?, ?, ?, ?)`;
        db.run(orderQuery, [userId, totalPrice, name, address, paymentMethod], function (err) {
            if (err) {
                console.error('Error placing order:', err);
                return res.status(500).send('Error placing order');
            }

            const clearCartQuery = `DELETE FROM CART WHERE USER_ID = ?`;
            db.run(clearCartQuery, [userId], (err) => {
                if (err) {
                    console.error('Error clearing cart:', err);
                    return res.status(500).send('Error clearing cart');
                }
                res.status(200).send('Order placed successfully');
            });
        });
    });
});

// Admin: Add Products
app.post('/admin/products/add', (req, res) => {
    const { name, description, price, quantity } = req.body;

    const query = `INSERT INTO PRODUCT (NAME, DESCRIPTION, PRICE, QUANTITY) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, description, parseFloat(price), parseInt(quantity, 10)], (err) => {
        if (err) {
            console.error('Error adding product:', err);
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
