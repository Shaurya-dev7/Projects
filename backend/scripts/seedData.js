const bcrypt = require('bcryptjs');
const faker = require('faker');
const { 
  User, 
  Category, 
  Product, 
  Address,
  Cart,
  Review,
  sequelize 
} = require('../models');

// Product data templates
const categories = [
  { name: 'Electronics', slug: 'electronics', description: 'Latest electronic devices and gadgets' },
  { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel for all occasions' },
  { name: 'Books', slug: 'books', description: 'Wide selection of books and literature' },
  { name: 'Home & Garden', slug: 'home-garden', description: 'Everything for your home and garden' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports equipment and outdoor gear' },
  { name: 'Health & Beauty', slug: 'health-beauty', description: 'Health and beauty products' },
  { name: 'Toys & Games', slug: 'toys-games', description: 'Fun toys and games for all ages' },
  { name: 'Automotive', slug: 'automotive', description: 'Car parts and automotive accessories' }
];

const productTemplates = {
  electronics: [
    'Smartphone', 'Laptop', 'Tablet', 'Smart Watch', 'Headphones', 'Camera', 'Gaming Console', 
    'TV', 'Bluetooth Speaker', 'Drone', 'VR Headset', 'Smart Home Device'
  ],
  clothing: [
    'T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Shorts', 'Sneakers', 'Boots', 
    'Hat', 'Backpack', 'Handbag', 'Sunglasses'
  ],
  books: [
    'Novel', 'Science Fiction Book', 'Mystery Novel', 'Biography', 'Cookbook', 'Self-Help Book',
    'History Book', 'Technical Manual', 'Art Book', 'Children\'s Book'
  ],
  'home-garden': [
    'Kitchen Appliance', 'Garden Tool', 'Furniture', 'Bedding Set', 'Cookware', 'Lamp',
    'Plant Pot', 'Storage Box', 'Vacuum Cleaner', 'Coffee Maker'
  ],
  'sports-outdoors': [
    'Running Shoes', 'Yoga Mat', 'Camping Tent', 'Bicycle', 'Fitness Tracker', 'Water Bottle',
    'Backpack', 'Hiking Boots', 'Sports Equipment', 'Outdoor Jacket'
  ],
  'health-beauty': [
    'Skincare Set', 'Makeup Kit', 'Hair Care Product', 'Vitamin Supplement', 'Fitness Equipment',
    'Essential Oil', 'Face Mask', 'Shampoo', 'Moisturizer', 'Perfume'
  ],
  'toys-games': [
    'Board Game', 'Puzzle', 'Action Figure', 'Doll', 'Building Blocks', 'Video Game',
    'Educational Toy', 'Remote Control Car', 'Art Supplies', 'Musical Instrument'
  ],
  automotive: [
    'Car Charger', 'GPS Navigator', 'Car Cover', 'Tire Gauge', 'Jump Starter', 'Car Vacuum',
    'Dash Cam', 'Car Phone Mount', 'Floor Mats', 'Car Air Freshener'
  ]
};

const brands = [
  'TechCorp', 'StylePlus', 'HomeEssentials', 'SportMax', 'BeautyPro', 'GameZone', 'AutoTech',
  'BookWorld', 'ElectroMax', 'FashionHub', 'GardenLife', 'HealthFirst', 'PlayTime'
];

function getRandomPrice(category) {
  const priceRanges = {
    electronics: [50, 2000],
    clothing: [15, 200],
    books: [10, 50],
    'home-garden': [20, 500],
    'sports-outdoors': [25, 300],
    'health-beauty': [15, 100],
    'toys-games': [10, 150],
    automotive: [20, 300]
  };
  
  const range = priceRanges[category] || [10, 100];
  return faker.random.number({ min: range[0], max: range[1] });
}

function generateProductImages() {
  return [
    faker.image.imageUrl(400, 400, 'business', true),
    faker.image.imageUrl(400, 400, 'business', true),
    faker.image.imageUrl(400, 400, 'business', true)
  ];
}

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@amazon-clone.com',
      password: adminPassword,
      isAdmin: true,
      phone: '1234567890'
    });

    // Create admin cart
    await Cart.create({ userId: admin.id });

    console.log('✅ Admin user created');

    // Create test users
    const users = [];
    for (let i = 0; i < 20; i++) {
      const password = await bcrypt.hash('password123', 12);
      const user = await User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password,
        phone: faker.phone.phoneNumber(),
        dateOfBirth: faker.date.past(30, new Date(2005, 0, 1))
      });

      // Create cart for user
      await Cart.create({ userId: user.id });

      // Create address for user
      await Address.create({
        userId: user.id,
        type: 'both',
        firstName: user.firstName,
        lastName: user.lastName,
        addressLine1: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        postalCode: faker.address.zipCode(),
        country: 'United States',
        phone: user.phone,
        isDefault: true
      });

      users.push(user);
    }

    console.log('✅ Test users created');

    // Create categories
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await Category.create({
        ...categoryData,
        sortOrder: categories.indexOf(categoryData)
      });
      createdCategories.push(category);
    }

    console.log('✅ Categories created');

    // Create products
    const products = [];
    for (const category of createdCategories) {
      const productNames = productTemplates[category.slug] || [];
      
      for (let i = 0; i < 15; i++) { // 15 products per category
        const baseName = faker.random.arrayElement(productNames);
        const brand = faker.random.arrayElement(brands);
        const model = faker.random.alphaNumeric(6).toUpperCase();
        
        const price = getRandomPrice(category.slug);
        const originalPrice = Math.random() > 0.7 ? price + faker.random.number({ min: 10, max: 100 }) : null;
        
        const product = await Product.create({
          name: `${brand} ${baseName} ${model}`,
          description: faker.lorem.paragraphs(3),
          shortDescription: faker.lorem.sentence(),
          price,
          originalPrice,
          sku: `${category.slug.toUpperCase()}-${faker.random.alphaNumeric(8).toUpperCase()}`,
          stock: faker.random.number({ min: 0, max: 100 }),
          images: generateProductImages(),
          brand,
          model,
          weight: faker.random.number({ min: 0.1, max: 50 }),
          dimensions: {
            length: faker.random.number({ min: 5, max: 100 }),
            width: faker.random.number({ min: 5, max: 100 }),
            height: faker.random.number({ min: 1, max: 50 })
          },
          categoryId: category.id,
          isFeatured: Math.random() > 0.8, // 20% chance of being featured
          tags: faker.random.words(3).split(' '),
          specifications: {
            color: faker.commerce.color(),
            warranty: `${faker.random.number({ min: 6, max: 36 })} months`,
            brand: brand
          },
          views: faker.random.number({ min: 0, max: 1000 })
        });

        products.push(product);
      }
    }

    console.log('✅ Products created');

    // Create reviews
    for (let i = 0; i < 200; i++) {
      const user = faker.random.arrayElement(users);
      const product = faker.random.arrayElement(products);
      
      // Check if user already reviewed this product
      const existingReview = await Review.findOne({
        where: { userId: user.id, productId: product.id }
      });

      if (!existingReview) {
        const rating = faker.random.number({ min: 1, max: 5 });
        await Review.create({
          userId: user.id,
          productId: product.id,
          rating,
          title: faker.lorem.sentence(),
          comment: faker.lorem.paragraphs(2),
          isVerifiedPurchase: Math.random() > 0.3, // 70% verified purchases
          helpfulCount: faker.random.number({ min: 0, max: 20 })
        });
      }
    }

    console.log('✅ Reviews created');

    // Update product ratings
    for (const product of products) {
      const reviews = await Review.findAll({
        where: { productId: product.id, isApproved: true }
      });

      if (reviews.length > 0) {
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        await product.update({
          averageRating: averageRating.toFixed(2),
          reviewCount: reviews.length
        });
      }
    }

    console.log('✅ Product ratings updated');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Seeding Summary:
- Categories: ${categories.length}
- Products: ${products.length}
- Users: ${users.length + 1} (including admin)
- Reviews: ~200
    
🔐 Admin Login:
Email: admin@amazon-clone.com
Password: admin123

🔐 Test User Login:
Email: Any of the generated user emails
Password: password123
    `);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;