import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: UserRole
        firstName: string
        lastName: string
      }
    }
  }
}

export interface JWTPayload {
  id: string
  email: string
  role: UserRole
  firstName: string
  lastName: string
}

// Verify JWT token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant',
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou expiré',
      })
    }

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé ou désactivé',
      })
    }

    req.user = user
    return next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      success: false,
      message: 'Erreur d\'authentification',
    })
  }
}

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = verifyToken(token)

      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            role: true,
            firstName: true,
            lastName: true,
            isActive: true,
          },
        })

        if (user && user.isActive) {
          req.user = user
        }
      }
    }

    return next()
  } catch (error) {
    // Continue without authentication
    return next()
  }
}

// Role-based authorization middleware
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes',
      })
    }

    return next()
  }
}

// Admin only middleware
export const adminOnly = authorize(UserRole.ADMIN)

// Seller only middleware
export const sellerOnly = authorize(UserRole.SELLER)

// Buyer only middleware
export const buyerOnly = authorize(UserRole.BUYER)

// Admin or seller middleware
export const adminOrSeller = authorize(UserRole.ADMIN, UserRole.SELLER)

// Admin or buyer middleware
export const adminOrBuyer = authorize(UserRole.ADMIN, UserRole.BUYER)

// Resource ownership middleware
export const checkOwnership = (resourceType: 'product' | 'review' | 'order') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentification requise',
        })
      }

      const resourceId = req.params.id
      let resource: any

      switch (resourceType) {
        case 'product':
          resource = await prisma.product.findUnique({
            where: { id: resourceId },
            select: { sellerId: true },
          })
          break
        case 'review':
          resource = await prisma.review.findUnique({
            where: { id: resourceId },
            select: { userId: true },
          })
          break
        case 'order':
          resource = await prisma.order.findUnique({
            where: { id: resourceId },
            select: { buyerId: true },
          })
          break
      }

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Ressource non trouvée',
        })
      }

      // Check if user owns the resource or is admin
      const isOwner = 
        (resourceType === 'product' && resource.sellerId === req.user.id) ||
        (resourceType === 'review' && resource.userId === req.user.id) ||
        (resourceType === 'order' && resource.buyerId === req.user.id)

      if (!isOwner && req.user.role !== UserRole.ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'Vous n\'êtes pas autorisé à modifier cette ressource',
        })
      }

      return next()
    } catch (error) {
      console.error('Ownership check error:', error)
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des permissions',
      })
    }
  }
} 