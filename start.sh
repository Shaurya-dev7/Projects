#!/bin/bash

echo "🚀 Starting Amazon Clone Application Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js version 16 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not installed. Please install PostgreSQL and update the DATABASE_URL in backend/.env"
fi

print_status "Installing root dependencies..."
npm install

print_status "Installing backend dependencies..."
cd backend && npm install
cd ..

print_status "Installing frontend dependencies..."
cd frontend && npm install --legacy-peer-deps
cd ..

print_success "All dependencies installed successfully!"

echo ""
echo "📋 Next Steps:"
echo "1. Make sure PostgreSQL is running on your system"
echo "2. Update the DATABASE_URL in backend/.env if needed"
echo "3. Run the following commands to set up the database:"
echo "   cd backend && npm run db:setup && npm run db:seed"
echo "4. Start the application:"
echo "   npm run dev (from the root directory)"
echo ""
echo "🔗 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "🔐 Demo Login Credentials:"
echo "   Admin: admin@amazon-clone.com / admin123"
echo "   User: Any generated email / password123"
echo ""
print_success "Setup completed! Happy coding! 🎉"