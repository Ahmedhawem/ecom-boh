import express from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { validateUserUpdate } from '@/middleware/validation'
import { UserRole } from '@prisma/client'
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserById, 
  getAllUsers, 
  deleteUser,
  getUserStats
} from '@/controllers/userController'

const router = express.Router()

// Protected routes (authenticated users)
router.get('/profile', authenticate, getUserProfile)
router.put('/profile', authenticate, validateUserUpdate, updateUserProfile)
router.get('/stats', authenticate, getUserStats)

// Public routes
router.get('/:id', getUserById)

// Admin only routes
router.get('/', authenticate, authorize(UserRole.ADMIN), getAllUsers)
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteUser)

export default router 