# Amazon Clone - Full E-commerce Platform

A complete Amazon-style e-commerce platform built with React frontend and Node.js backend.

## Features

- 🛍️ Complete product catalog with categories
- 🔍 Advanced search and filtering
- 🛒 Shopping cart functionality
- 👤 User authentication and profiles
- 💳 Payment simulation system
- 📦 Order tracking and management
- ⭐ Product reviews and ratings
- 👨‍💼 Admin dashboard
- 📱 Responsive design
- 🚚 Delivery simulation

## Tech Stack

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- React Hook Form

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Bcrypt
- Multer (file uploads)

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd amazon-clone
```

2. Install all dependencies
```bash
npm run install-all
```

3. Set up environment variables
```bash
# Backend (.env in backend folder)
DATABASE_URL=postgresql://username:password@localhost:5432/amazon_clone
JWT_SECRET=your-secret-key
PORT=5000

# Frontend (.env in frontend folder)
REACT_APP_API_URL=http://localhost:5000
```

4. Set up the database
```bash
cd backend
npm run db:setup
npm run db:seed
```

5. Start the development servers
```bash
npm run dev
```

## Quick Start Script

For a quick setup, you can run the automated setup script:

```bash
chmod +x start.sh
./start.sh
```

This script will:
- Install all dependencies for both frontend and backend
- Provide setup instructions for the database
- Show you the demo login credentials

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
amazon-clone/
├── frontend/          # React frontend
├── backend/           # Node.js backend
├── package.json       # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)

### Cart
- GET /api/cart
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/remove

### Orders
- GET /api/orders
- POST /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/status (admin)

### Reviews
- GET /api/products/:id/reviews
- POST /api/products/:id/reviews
- PUT /api/reviews/:id
- DELETE /api/reviews/:id

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
