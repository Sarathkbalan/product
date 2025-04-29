// import express from 'express';
// // import Wishlist from '../model/Wishlist.js';
// import Product from '../models/product.js';
// import User from '../models/user.js';
// import { authenticateUser } from '../middleware/auth.js'; // assuming you have this

const router = express.Router();

// Add product to wishlist
router.post('/add', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    res.status(200).json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove product from wishlist
router.put('/remove', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } }
    );

    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get wishlist products
router.get('/products', authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');

    if (!wishlist) return res.status(200).json({ products: [] });

    res.status(200).json({ products: wishlist.products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
