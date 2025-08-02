const express = require('express');
const { Review, Product, User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const offset = (page - 1) * limit;

    const where = { 
      productId: req.params.productId,
      isApproved: true
    };

    if (rating) {
      where.rating = parseInt(rating);
    }

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create review for a product
router.post('/product/:productId', authMiddleware, validateReview, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      where: { userId: req.user.id, productId }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create review
    const review = await Review.create({
      userId: req.user.id,
      productId,
      rating,
      title,
      comment
    });

    // Update product average rating and review count
    await updateProductRating(productId);

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.status(201).json({
      message: 'Review created successfully',
      review: reviewWithUser
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user's review
router.put('/:id', authMiddleware, validateReview, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.update({ rating, title, comment });

    // Update product average rating
    await updateProductRating(review.productId);

    const updatedReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user's review
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const productId = review.productId;
    await review.destroy();

    // Update product average rating
    await updateProductRating(productId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark review as helpful
router.post('/:id/helpful', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.increment('helpfulCount');

    res.json({ message: 'Review marked as helpful' });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reviews
router.get('/user/my-reviews', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'images']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all reviews
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, approved } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (approved !== undefined) {
      where.isApproved = approved === 'true';
    }

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'images']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get admin reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Approve/reject review
router.put('/:id/approval', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.update({ isApproved });

    // Update product rating if review status changed
    if (review.isApproved !== isApproved) {
      await updateProductRating(review.productId);
    }

    res.json({
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      review
    });
  } catch (error) {
    console.error('Update review approval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  const reviews = await Review.findAll({
    where: { productId, isApproved: true },
    attributes: ['rating']
  });

  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
    : 0;

  await Product.update(
    { 
      averageRating: averageRating.toFixed(2),
      reviewCount 
    },
    { where: { id: productId } }
  );
}

module.exports = router;