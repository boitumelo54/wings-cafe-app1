const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database if it doesn't exist
async function initializeDatabase() {
    try {
        const data = await fs.readFile(DB_FILE, 'utf8');
        if (!data) {
            const initialData = {
                products: [],
                transactions: [],
                customers: [],
                sales: []
            };
            await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
        }
    } catch (error) {
        const initialData = {
            products: [],
            transactions: [],
            customers: [],
            sales: []
        };
        await fs.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
    }
}

// Helper function to read database
async function readDatabase() {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Helper function to write to database
async function writeDatabase(data) {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
}

// Product Management Endpoints

// Add new product
app.post('/api/products', async (req, res) => {
    try {
        const { name, description, category, price, quantity } = req.body;
        if (!name || !category || !price || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await readDatabase();
        const newProduct = {
            id: Date.now().toString(),
            name,
            description,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            createdAt: new Date().toISOString()
        };

        db.products.push(newProduct);
        await writeDatabase(db);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db.products);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, quantity } = req.body;
        const db = await readDatabase();
        
        const productIndex = db.products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        db.products[productIndex] = {
            ...db.products[productIndex],
            name: name || db.products[productIndex].name,
            description: description || db.products[productIndex].description,
            category: category || db.products[productIndex].category,
            price: price ? parseFloat(price) : db.products[productIndex].price,
            quantity: quantity ? parseInt(quantity) : db.products[productIndex].quantity,
            updatedAt: new Date().toISOString()
        };

        await writeDatabase(db);
        res.json(db.products[productIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await readDatabase();
        
        const productIndex = db.products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        db.products.splice(productIndex, 1);
        await writeDatabase(db);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Stock Transaction Endpoints

// Add stock transaction (add/subtract stock)
app.post('/api/transactions', async (req, res) => {
    try {
        const { productId, type, quantity, notes } = req.body;
        if (!productId || !type || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await readDatabase();
        const product = db.products.find(p => p.id === productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update product quantity based on transaction type
        if (type === 'add') {
            product.quantity += parseInt(quantity);
        } else if (type === 'subtract') {
            if (product.quantity < parseInt(quantity)) {
                return res.status(400).json({ error: 'Insufficient stock' });
            }
            product.quantity -= parseInt(quantity);
        } else {
            return res.status(400).json({ error: 'Invalid transaction type' });
        }

        const transaction = {
            id: Date.now().toString(),
            productId,
            type,
            quantity: parseInt(quantity),
            notes,
            createdAt: new Date().toISOString()
        };

        db.transactions.push(transaction);
        await writeDatabase(db);

        // Check for low stock
        if (product.quantity < 10) {
            res.json({ 
                transaction,
                warning: `Low stock alert: ${product.name} has only ${product.quantity} units left`
            });
        } else {
            res.json(transaction);
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db.transactions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
async function startServer() {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();