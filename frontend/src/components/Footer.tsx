import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Amazon Clone</h3>
            <p className="text-sm text-gray-300 mb-4">
              Your one-stop shop for everything you need. Fast shipping, great prices, and excellent customer service.
            </p>
            <div className="flex space-x-4">
              <span className="text-2xl font-bold text-white">Amazon</span>
              <span className="text-2xl font-bold text-accent">Clone</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm text-gray-300 hover:text-accent">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="text-sm text-gray-300 hover:text-accent">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-sm text-gray-300 hover:text-accent">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=clothing" className="text-sm text-gray-300 hover:text-accent">
                  Clothing
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-accent">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-accent">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-accent">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-accent">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold mb-4">My Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-sm text-gray-300 hover:text-accent">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-sm text-gray-300 hover:text-accent">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-gray-300 hover:text-accent">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-300 hover:text-accent">
                  Wishlist
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2024 Amazon Clone. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-300 hover:text-accent">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-accent">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-accent">
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-400">
            This is a demo e-commerce application built with React and Node.js
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;