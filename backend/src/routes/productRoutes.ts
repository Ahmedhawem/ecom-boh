import express from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { validateProduct, validateProductUpdate } from '@/middleware/validation'
import { UserRole } from '@prisma/client'
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductsByUser,
  searchProducts,
  getProductsByCategory
} from '@/controllers/productController'

const router = express.Router()

// Public routes
router.get('/', getAllProducts)
router.get('/search', searchProducts)
router.get('/category/:categoryId', getProductsByCategory)
router.get('/:id', getProductById)

// Protected routes
router.get('/user/me', authenticate, getProductsByUser)
router.post('/', authenticate, authorize(UserRole.SELLER, UserRole.ADMIN), validateProduct, createProduct)
router.put('/:id', authenticate, authorize(UserRole.SELLER, UserRole.ADMIN), validateProductUpdate, updateProduct)
router.delete('/:id', authenticate, authorize(UserRole.SELLER, UserRole.ADMIN), deleteProduct)

export default router 