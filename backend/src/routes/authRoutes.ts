import { Router } from 'express'
import { AuthController } from '@/controllers/authController'
import {
  authenticate,
  adminOnly,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateIdParam,
} from '@/middleware'

const router = Router()

// Public routes
router.post('/register', validateUserRegistration, AuthController.register)
router.post('/login', validateUserLogin, AuthController.login)
router.post('/verify-token', AuthController.verifyToken)

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile)
router.put('/profile', authenticate, validateUserUpdate, AuthController.updateProfile)
router.put('/change-password', authenticate, AuthController.changePassword)
router.post('/refresh-token', authenticate, AuthController.refreshToken)
router.post('/logout', authenticate, AuthController.logout)

// Admin routes
router.get('/users', authenticate, adminOnly, AuthController.getAllUsers)
router.put('/users/:id/status', authenticate, adminOnly, validateIdParam, AuthController.updateUserStatus)
router.put('/users/:id/role', authenticate, adminOnly, validateIdParam, AuthController.updateUserRole)

export default router 