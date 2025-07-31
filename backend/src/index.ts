import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import { errorHandler, notFound, setupGracefulShutdown } from '@/middleware'
import { testDatabaseConnection } from '@/utils/database'
import authRoutes from '@/routes/authRoutes'

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

// Placeholder routes (to be implemented)
app.use('/api/users', (req, res) => {
  res.json({ message: 'User routes will be implemented here' })
})

app.use('/api/products', (req, res) => {
  res.json({ message: 'Product routes will be implemented here' })
})

app.use('/api/categories', (req, res) => {
  res.json({ message: 'Category routes will be implemented here' })
})

app.use('/api/reviews', (req, res) => {
  res.json({ message: 'Review routes will be implemented here' })
})

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
      console.log('  POST /api/auth/register - Register new user')
      console.log('  POST /api/auth/login - Login user')
      console.log('  GET  /api/auth/profile - Get user profile (protected)')
      console.log('  PUT  /api/auth/profile - Update user profile (protected)')
      console.log('  POST /api/auth/logout - Logout user (protected)')
      console.log('  GET  /api/auth/users - Get all users (admin only)')
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