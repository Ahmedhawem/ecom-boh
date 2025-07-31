import express from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { validateCategory } from '@/middleware/validation'
import { UserRole } from '@prisma/client'
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategoryWithProducts
} from '@/controllers/categoryController'

const router = express.Router()

// Public routes
router.get('/', getAllCategories)
router.get('/:id', getCategoryById)
router.get('/:id/products', getCategoryWithProducts)

// Admin only routes
router.post('/', authenticate, authorize(UserRole.ADMIN), validateCategory, createCategory)
router.put('/:id', authenticate, authorize(UserRole.ADMIN), validateCategory, updateCategory)
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteCategory)

export default router 