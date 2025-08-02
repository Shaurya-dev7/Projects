import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        
        const message = error.response?.data?.message || 'An error occurred';
        toast.error(message);
        
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.api.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await this.api.put('/auth/change-password', data);
    return response.data;
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    featured?: boolean;
    inStock?: boolean;
  }) {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  async getProduct(id: string) {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async getFeaturedProducts(limit?: number) {
    const response = await this.api.get('/products/featured/list', {
      params: { limit }
    });
    return response.data;
  }

  async getRelatedProducts(productId: string, limit?: number) {
    const response = await this.api.get(`/products/${productId}/related`, {
      params: { limit }
    });
    return response.data;
  }

  // Categories endpoints
  async getCategories() {
    const response = await this.api.get('/admin/categories');
    return response.data;
  }

  // Cart endpoints
  async getCart() {
    const response = await this.api.get('/cart');
    return response.data;
  }

  async addToCart(productId: string, quantity: number = 1) {
    const response = await this.api.post('/cart/add', { productId, quantity });
    return response.data;
  }

  async updateCartItem(productId: string, quantity: number) {
    const response = await this.api.put('/cart/update', { productId, quantity });
    return response.data;
  }

  async removeFromCart(productId: string) {
    const response = await this.api.delete(`/cart/remove/${productId}`);
    return response.data;
  }

  async clearCart() {
    const response = await this.api.delete('/cart/clear');
    return response.data;
  }

  // Orders endpoints
  async createOrder(orderData: {
    shippingAddressId: string;
    paymentMethod: string;
    notes?: string;
  }) {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }

  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const response = await this.api.get('/orders', { params });
    return response.data;
  }

  async getOrder(orderId: string) {
    const response = await this.api.get(`/orders/${orderId}`);
    return response.data;
  }

  async cancelOrder(orderId: string) {
    const response = await this.api.put(`/orders/${orderId}/cancel`);
    return response.data;
  }

  // Reviews endpoints
  async getProductReviews(productId: string, params?: {
    page?: number;
    limit?: number;
    rating?: number;
  }) {
    const response = await this.api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  }

  async createReview(productId: string, reviewData: {
    rating: number;
    title?: string;
    comment: string;
  }) {
    const response = await this.api.post(`/reviews/product/${productId}`, reviewData);
    return response.data;
  }

  async updateReview(reviewId: string, reviewData: {
    rating: number;
    title?: string;
    comment: string;
  }) {
    const response = await this.api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  }

  async deleteReview(reviewId: string) {
    const response = await this.api.delete(`/reviews/${reviewId}`);
    return response.data;
  }

  async markReviewHelpful(reviewId: string) {
    const response = await this.api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  }

  async getUserReviews(params?: {
    page?: number;
    limit?: number;
  }) {
    const response = await this.api.get('/reviews/user/my-reviews', { params });
    return response.data;
  }

  // Addresses endpoints
  async getAddresses() {
    const response = await this.api.get('/addresses');
    return response.data;
  }

  async createAddress(addressData: any) {
    const response = await this.api.post('/addresses', addressData);
    return response.data;
  }

  async updateAddress(addressId: string, addressData: any) {
    const response = await this.api.put(`/addresses/${addressId}`, addressData);
    return response.data;
  }

  async deleteAddress(addressId: string) {
    const response = await this.api.delete(`/addresses/${addressId}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;