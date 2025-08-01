import express from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { UserRole } from '@prisma/client'
import { 
  getDashboardStats,
  getAllUsersAdmin,
  getAllProductsAdmin,
  updateProductApproval,
  updateUserRole,
  toggleUserStatus,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory
} from '@/controllers/adminController'

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticate, authorize(UserRole.ADMIN))

// Dashboard
router.get('/dashboard', getDashboardStats)

// User management
router.get('/users', getAllUsersAdmin)
router.put('/users/:id/role', updateUserRole)
router.put('/users/:id/status', toggleUserStatus)

// Product management
router.get('/products', getAllProductsAdmin)
router.put('/products/:id/approval', updateProductApproval)

// Category management
router.get('/categories', getAllCategoriesAdmin)
router.post('/categories', createCategory)
router.put('/categories/:id', updateCategory)
router.delete('/categories/:id', deleteCategory)

export default router 