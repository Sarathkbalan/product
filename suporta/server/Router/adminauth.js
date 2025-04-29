import { Router } from 'express';
import Product from '../model/product.js';
import upload from '../Middleware/upload.js';

const adminauth = Router();

// POST /product
adminauth.post('/product', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!req.file) {
      return res.status(400).send("Image is required");
    }

    const imageUrl = req.file.path;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      imageUrl
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Product creation failed", error);
    res.status(500).send("Server Error");
  }
});

adminauth.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.json(product);
  } catch (error) {
    console.error("Failed to get product", error);
    res.status(500).send("Server Error");
  }
});

adminauth.put('/product/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const updateData = { name, description, price, category };

    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) return res.status(404).send("Product not found");

    res.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product", error);
    res.status(500).send("Server Error");
  }
});

adminauth.delete('/product/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).send("Product not found");
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product", error);
    res.status(500).send("Server Error");
  }
});


export default adminauth;

                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  