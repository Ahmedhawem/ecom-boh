import express from 'express'
import { authenticate, authorize } from '@/middleware/auth'
import { validateReviewCreation, validateReviewUpdate } from '@/middleware/validation'
import { UserRole } from '@prisma/client'
import { 
  getProductReviews, 
  createReview, 
  updateReview, 
  deleteReview,
  getUserReviews
} from '@/controllers/reviewController'

const router = express.Router()

// Public routes
router.get('/product/:productId', getProductReviews)

// Protected routes
router.get('/user/me', authenticate, getUserReviews)
router.post('/product/:productId', authenticate, authorize(UserRole.BUYER, UserRole.ADMIN), validateReviewCreation, createReview)
router.put('/:id', authenticate, authorize(UserRole.BUYER, UserRole.ADMIN), validateReviewUpdate, updateReview)
router.delete('/:id', authenticate, authorize(UserRole.BUYER, UserRole.ADMIN), deleteReview)

export default router 