import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import products from './data/products.js'; // 👈 1. Import manquant

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/products', (req, res) => {
  res.json(products); // 👈 2. Syntaxe corrigée
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});