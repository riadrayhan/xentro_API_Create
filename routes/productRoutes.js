const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Ensure this path is correct

// GET /products - Retrieve a list of products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error retrieving products:', err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// GET /products/:id - Retrieve a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error retrieving product:', err);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

// POST /products - Create multiple new products
router.post('/', async (req, res) => {
  const products = req.body; // Expecting an array of product objects

  // Input validation
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'Request body must be an array of products' });
  }

  for (const product of products) {
    const { name, description, price, imageUrl } = product;

    if (!name || !description || !price) {
      return res.status(400).json({ error: 'Name, description, and price are required for each product' });
    }
  }

  try {
    // Insert multiple products
    const newProducts = await Product.insertMany(products);
    res.status(201).json(newProducts);
  } catch (err) {
    console.error('Error creating products:', err);
    res.status(500).json({ error: 'Failed to create products' });
  }
});

// PUT /products/:id - Update an existing product
router.put('/:id', async (req, res) => {
  const { name, description, price, imageUrl } = req.body;

  // Input validation
  if (!name || !description || !price) {
    return res.status(400).json({ error: 'Name, description, and price are required' });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, imageUrl },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
