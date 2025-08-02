const express = require('express');
const { Cart, CartItem, Product } = require('../models');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'images', 'stock', 'isActive']
            }
          ]
        }
      ]
    });

    if (!cart) {
      // Create cart if it doesn't exist
      const newCart = await Cart.create({ userId: req.user.id });
      return res.json({
        cart: {
          ...newCart.toJSON(),
          items: []
        }
      });
    }

    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists and is active
    const product = await Product.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (cartItem) {
      // Update existing item
      const newQuantity = cartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Cannot add more items than available stock' });
      }

      cartItem.quantity = newQuantity;
      cartItem.totalPrice = cartItem.price * newQuantity;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
        totalPrice: product.price * quantity
      });
    }

    // Update cart totals
    await updateCartTotals(cart.id);

    // Get updated cart with items
    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'images', 'stock', 'isActive']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Item added to cart successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Valid product ID and quantity are required' });
    }

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['stock']
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check stock availability
    if (quantity > cartItem.product.stock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Update cart item
    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.price * quantity;
    await cartItem.save();

    // Update cart totals
    await updateCartTotals(cart.id);

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'images', 'stock', 'isActive']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Cart updated successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/remove/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cartItem.destroy();

    // Update cart totals
    await updateCartTotals(cart.id);

    // Get updated cart
    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'images', 'stock', 'isActive']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Item removed from cart successfully',
      cart: updatedCart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });

    // Update cart totals
    await cart.update({
      totalAmount: 0,
      totalItems: 0
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update cart totals
async function updateCartTotals(cartId) {
  const cartItems = await CartItem.findAll({
    where: { cartId }
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  await Cart.update(
    { totalAmount, totalItems },
    { where: { id: cartId } }
  );
}

module.exports = router;