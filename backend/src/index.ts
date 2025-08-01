import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { errorHandler, notFound, setupGracefulShutdown } from '@/middleware'
import { testDatabaseConnection } from '@/utils/database'
import authRoutes from '@/routes/authRoutes'
import userRoutes from '@/routes/userRoutes'
import productRoutes from '@/routes/productRoutes'
import categoryRoutes from '@/routes/categoryRoutes'
import reviewRoutes from '@/routes/reviewRoutes'
import adminRoutes from '@/routes/adminRoutes'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Logging middleware
app.use(morgan('combined'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static('uploads'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/admin', adminRoutes)

// Placeholder routes (to be implemented)

app.use('/api/orders', (req, res) => {
  res.json({ message: 'Order routes will be implemented here' })
})

app.use('/api/messages', (req, res) => {
  res.json({ message: 'Contact message routes will be implemented here' })
})

// 404 handler
app.use('*', notFound)

// Error handling middleware
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testDatabaseConnection()
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...')
      process.exit(1)
    }

    // Setup graceful shutdown
    setupGracefulShutdown()

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`)
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🔗 Health check: http://localhost:${PORT}/health`)
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
      console.log(`🔗 Auth endpoints: http://localhost:${PORT}/api/auth`)
      console.log('\n📝 Available endpoints:')
      console.log('🔐 Auth endpoints:')
      console.log('  POST /api/auth/register - Register new user')
      console.log('  POST /api/auth/login - Login user')
      console.log('  GET  /api/auth/profile - Get user profile (protected)')
      console.log('  PUT  /api/auth/profile - Update user profile (protected)')
      console.log('  POST /api/auth/logout - Logout user (protected)')
      console.log('  GET  /api/auth/users - Get all users (admin only)')
      console.log('\n👥 User endpoints:')
      console.log('  GET  /api/users/profile - Get user profile (protected)')
      console.log('  PUT  /api/users/profile - Update user profile (protected)')
      console.log('  GET  /api/users/stats - Get user statistics (protected)')
      console.log('  GET  /api/users/:id - Get user by ID (public)')
      console.log('  GET  /api/users - Get all users (admin only)')
      console.log('  DELETE /api/users/:id - Delete user (admin only)')
      console.log('\n📦 Product endpoints:')
      console.log('  GET  /api/products - Get all products (public)')
      console.log('  GET  /api/products/search - Search products (public)')
      console.log('  GET  /api/products/:id - Get product by ID (public)')
      console.log('  POST /api/products - Create product (seller/admin)')
      console.log('  PUT  /api/products/:id - Update product (owner/admin)')
      console.log('  DELETE /api/products/:id - Delete product (owner/admin)')
      console.log('  GET  /api/products/user/my-products - Get user products (protected)')
      console.log('  GET  /api/products/category/:categoryId - Get products by category (public)')
      console.log('\n📂 Category endpoints:')
      console.log('  GET  /api/categories - Get all categories (public)')
      console.log('  GET  /api/categories/:id - Get category by ID (public)')
      console.log('  GET  /api/categories/:id/products - Get category products (public)')
      console.log('  POST /api/categories - Create category (admin only)')
      console.log('  PUT  /api/categories/:id - Update category (admin only)')
      console.log('  DELETE /api/categories/:id - Delete category (admin only)')
      console.log('\n⭐ Review endpoints:')
      console.log('  GET  /api/reviews/product/:productId - Get product reviews (public)')
      console.log('  POST /api/reviews/product/:productId - Create review (buyer/admin)')
      console.log('  PUT  /api/reviews/:id - Update review (owner)')
      console.log('  DELETE /api/reviews/:id - Delete review (owner)')
      console.log('  GET  /api/reviews/user/my-reviews - Get user reviews (protected)')
      console.log('\n🔑 Test accounts (after seeding):')
      console.log('  Admin: admin@ecom-boh.com / admin123')
      console.log('  Seller: seller1@ecom-boh.com / seller123')
      console.log('  Buyer: buyer1@ecom-boh.com / buyer123')
    })
  } catch (error) {
    console.error('❌ Error starting server:', error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Start the server
startServer()

export default app 