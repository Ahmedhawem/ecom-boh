# Modern E-Commerce Platform

## Project Overview

This is a modern, full-stack e-commerce platform that allows users to buy and sell products with advanced features including user management, product categories, reviews, and admin dashboard.

## Features

### For Sellers (Product Owners)
- **User Registration & Authentication**: Secure account creation and login system
- **Product Management**: Add, edit, and manage products with detailed information
- **Product Information**: Upload product photos, descriptions, prices, and specifications
- **Category Management**: Organize products into categories
- **Contact Information**: Display seller contact details for customer inquiries
- **Product Reviews**: Receive and manage customer reviews
- **Admin Approval**: Products require admin approval before being published

### For Buyers (Customers)
- **User Registration**: Create accounts to purchase products
- **Product Browsing**: Browse products by categories with search functionality
- **Product Details**: View comprehensive product information, photos, and seller details
- **Contact Sellers**: Direct communication with product owners
- **Leave Reviews**: Rate and review purchased products
- **Secure Transactions**: Safe purchasing process

### For Administrators
- **Admin Dashboard**: Comprehensive platform management interface
- **Product Approval**: Review and approve/reject new product submissions
- **User Management**: Monitor and manage user accounts
- **Category Management**: Create and manage product categories
- **Content Moderation**: Moderate reviews and announcements
- **Platform Analytics**: View platform statistics and insights

## Technical Stack

### Frontend
- **React.js** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive styling
- **Framer Motion** - Beautiful animations and transitions
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **JWT** - Authentication and authorization
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

### Database
- **PostgreSQL** - Relational database
- **Prisma** - Type-safe database client
- **Redis** - Caching and session management

### Additional Technologies
- **Docker** - Containerization
- **AWS S3** - File storage for images
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications

## Database Schema

### Core Entities
- **Users**: User accounts with roles (buyer, seller, admin)
- **Products**: Product listings with categories, prices, and details
- **Categories**: Product categorization system
- **Reviews**: User reviews and ratings
- **Orders**: Purchase transactions
- **Announcements**: Platform announcements
- **Contact Messages**: Communication between users

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis
- Docker (optional)

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# JWT
JWT_SECRET="your-secret-key"

# Redis
REDIS_URL="redis://localhost:6379"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="your-bucket-name"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npm run db:migrate`
5. Start development server: `npm run dev`

## Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── prisma/             # Database schema and migrations
├── docs/                   # Documentation
└── docker/                 # Docker configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (seller only)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)

### Reviews
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add review (buyer only)

### Admin
- `GET /api/admin/products/pending` - Get pending products
- `PUT /api/admin/products/:id/approve` - Approve product
- `PUT /api/admin/products/:id/reject` - Reject product

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for buyers, sellers, and admins
- **Input Validation**: Comprehensive input sanitization
- **File Upload Security**: Secure image upload with validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Cross-origin resource sharing protection

## Performance Optimizations

- **Image Optimization**: Automatic image compression and resizing
- **Caching**: Redis caching for frequently accessed data
- **Database Indexing**: Optimized database queries
- **Lazy Loading**: Component and image lazy loading
- **CDN Integration**: Content delivery network for static assets

## Deployment

### Production Setup
1. Set up production environment variables
2. Build frontend: `npm run build`
3. Start production server: `npm start`
4. Set up reverse proxy (Nginx)
5. Configure SSL certificates

### Docker Deployment
```bash
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team. 