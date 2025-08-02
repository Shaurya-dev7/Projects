import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-accent">Amazon Clone</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Discover millions of products at unbeatable prices
            </p>
            <div className="space-x-4">
              <Link
                to="/products"
                className="bg-accent hover:bg-amazon-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
              >
                Shop Now
              </Link>
              <Link
                to="/products?featured=true"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
              >
                Featured Products
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Amazon Clone?
            </h2>
            <p className="text-xl text-gray-600">
              We provide the best shopping experience with these amazing features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">
                Free shipping on orders over $50. Get your products delivered fast and secure.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                All products are carefully selected and tested to ensure the highest quality.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Your payment information is always secure with our encrypted payment system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Explore our wide range of product categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', slug: 'electronics', emoji: '📱' },
              { name: 'Clothing', slug: 'clothing', emoji: '👕' },
              { name: 'Books', slug: 'books', emoji: '📚' },
              { name: 'Home & Garden', slug: 'home-garden', emoji: '🏠' },
              { name: 'Sports', slug: 'sports-outdoors', emoji: '⚽' },
              { name: 'Health & Beauty', slug: 'health-beauty', emoji: '💄' },
              { name: 'Toys & Games', slug: 'toys-games', emoji: '🎮' },
              { name: 'Automotive', slug: 'automotive', emoji: '🚗' },
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition duration-300"
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Join millions of customers who trust Amazon Clone for their shopping needs
          </p>
          <Link
            to="/register"
            className="bg-accent hover:bg-amazon-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;