const express = require('express');
const { Op } = require('sequelize');
const { User, Product, Order, Category, Review } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    // Total counts
    const totalUsers = await User.count({ where: { isActive: true } });
    const totalProducts = await Product.count({ where: { isActive: true } });
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount', {
      where: { paymentStatus: 'paid' }
    });

    // This month statistics
    const thisMonthOrders = await Order.count({
      where: { createdAt: { [Op.gte]: thisMonth } }
    });
    const thisMonthRevenue = await Order.sum('totalAmount', {
      where: { 
        createdAt: { [Op.gte]: thisMonth },
        paymentStatus: 'paid'
      }
    });

    // Last month statistics for comparison
    const lastMonthOrders = await Order.count({
      where: { 
        createdAt: { 
          [Op.gte]: lastMonth,
          [Op.lt]: thisMonth
        }
      }
    });
    const lastMonthRevenue = await Order.sum('totalAmount', {
      where: { 
        createdAt: { 
          [Op.gte]: lastMonth,
          [Op.lt]: thisMonth
        },
        paymentStatus: 'paid'
      }
    });

    // Recent orders
    const recentOrders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Top selling products
    const topProducts = await Product.findAll({
      where: { isActive: true },
      order: [['views', 'DESC']],
      limit: 5,
      attributes: ['id', 'name', 'price', 'stock', 'views', 'averageRating']
    });

    // Order status distribution
    const orderStatusStats = await Order.findAll({
      attributes: [
        'status',
        [Order.sequelize.fn('COUNT', Order.sequelize.col('status')), 'count']
      ],
      group: ['status']
    });

    res.json({
      totalStats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue || 0
      },
      monthlyStats: {
        thisMonthOrders,
        thisMonthRevenue: thisMonthRevenue || 0,
        ordersGrowth: lastMonthOrders > 0 
          ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(2)
          : 0,
        revenueGrowth: lastMonthRevenue > 0 
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)
          : 0
      },
      recentOrders,
      topProducts,
      orderStatusStats: orderStatusStats.reduce((acc, stat) => {
        acc[stat.status] = parseInt(stat.getDataValue('count'));
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, active } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status
router.put('/users/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { isActive, isAdmin } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (isAdmin !== undefined) updates.isAdmin = isAdmin;

    await user.update(updates);

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'User status updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Categories management
router.get('/categories', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/categories', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, slug, sortOrder } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    const category = await Category.create({
      name,
      description,
      slug,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'Category name or slug already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

router.put('/categories/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update(req.body);

    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/categories/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.count({
      where: { categoryId: category.id, isActive: true }
    });

    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with active products' 
      });
    }

    await category.destroy();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sales analytics
router.get('/analytics/sales', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Daily sales for the period
    const dailySales = await Order.findAll({
      where: {
        createdAt: { [Op.gte]: startDate },
        paymentStatus: 'paid'
      },
      attributes: [
        [Order.sequelize.fn('DATE', Order.sequelize.col('createdAt')), 'date'],
        [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'orders'],
        [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'revenue']
      ],
      group: [Order.sequelize.fn('DATE', Order.sequelize.col('createdAt'))],
      order: [[Order.sequelize.fn('DATE', Order.sequelize.col('createdAt')), 'ASC']]
    });

    // Top selling products
    const topProducts = await Product.findAll({
      where: { isActive: true },
      order: [['views', 'DESC']],
      limit: 10,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    });

    // Revenue by category
    const categoryRevenue = await Order.findAll({
      where: { paymentStatus: 'paid' },
      include: [
        {
          model: require('../models').OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: Category,
                  as: 'category',
                  attributes: ['name']
                }
              ]
            }
          ]
        }
      ]
    });

    res.json({
      dailySales: dailySales.map(sale => ({
        date: sale.getDataValue('date'),
        orders: parseInt(sale.getDataValue('orders')),
        revenue: parseFloat(sale.getDataValue('revenue'))
      })),
      topProducts,
      period: days
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;