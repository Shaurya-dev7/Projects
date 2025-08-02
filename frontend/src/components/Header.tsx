import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary border-b border-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link to="/profile" className="text-white hover:text-accent text-sm">
                    Hello, {user?.firstName}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-white hover:text-accent text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="text-white hover:text-accent text-sm">
                    Sign In
                  </Link>
                  <span className="text-white">|</span>
                  <Link to="/register" className="text-white hover:text-accent text-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">Amazon</span>
                <span className="text-2xl font-bold text-accent">Clone</span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-accent text-white rounded-r-md hover:bg-amazon-600 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-white hover:text-accent">
              <ShoppingCartIcon className="h-6 w-6" />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {/* Account Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Link to="/profile" className="flex items-center space-x-1 p-2 text-white hover:text-accent">
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden md:block">Account</span>
                </Link>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 p-2 text-white hover:text-accent">
                <UserIcon className="h-6 w-6" />
                <span className="hidden md:block">Sign In</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:text-accent"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-10">
            <Link to="/products" className="text-white hover:text-accent text-sm font-medium">
              All Products
            </Link>
            <Link to="/products?category=electronics" className="text-white hover:text-accent text-sm font-medium">
              Electronics
            </Link>
            <Link to="/products?category=clothing" className="text-white hover:text-accent text-sm font-medium">
              Clothing
            </Link>
            <Link to="/products?category=books" className="text-white hover:text-accent text-sm font-medium">
              Books
            </Link>
            <Link to="/products?category=home-garden" className="text-white hover:text-accent text-sm font-medium">
              Home & Garden
            </Link>
            <Link to="/products?featured=true" className="text-white hover:text-accent text-sm font-medium">
              Featured
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-gray-600">
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/products"
              className="block px-3 py-2 text-white hover:text-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              to="/products?category=electronics"
              className="block px-3 py-2 text-white hover:text-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Electronics
            </Link>
            <Link
              to="/products?category=clothing"
              className="block px-3 py-2 text-white hover:text-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Clothing
            </Link>
            <Link
              to="/products?category=books"
              className="block px-3 py-2 text-white hover:text-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Books
            </Link>
            <Link
              to="/products?category=home-garden"
              className="block px-3 py-2 text-white hover:text-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home & Garden
            </Link>
            <Link
              to="/products?featured=true"
              className="block px-3 py-2 text-white hover:text-accent text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Featured
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;