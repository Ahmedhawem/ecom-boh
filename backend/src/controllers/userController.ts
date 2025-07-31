import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Get user profile (authenticated user)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
            reviews: true,
            sentMessages: true,
            receivedMessages: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error getting user profile:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    })
  }
}

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { firstName, lastName, phone, address, avatar, currentPassword, newPassword } = req.body

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const updateData: any = {
      firstName,
      lastName,
      phone,
      address,
      avatar
    }

    // Handle password change if provided
    if (currentPassword && newPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        })
      }

      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
      updateData.password = hashedPassword
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update user profile'
    })
  }
}

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            products: {
              where: {
                isApproved: true
              }
            },
            reviews: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error getting user:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get user'
    })
  }
}

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {}
    if (role) {
      where.role = role
    }
    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              products: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.user.count({ where })
    ])

    return res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error getting users:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get users'
    })
  }
}

// Delete user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const adminId = (req as any).user.id

    // Prevent admin from deleting themselves
    if (id === adminId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            reviews: true,
            sentMessages: true,
            receivedMessages: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user has any activity
    const hasActivity = user._count.products > 0 || 
                       user._count.reviews > 0 || 
                       user._count.sentMessages > 0 || 
                       user._count.receivedMessages > 0

    if (hasActivity) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with existing activity. Consider deactivating instead.'
      })
    }

    await prisma.user.delete({
      where: { id }
    })

    return res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
}

// Get user statistics
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id

    const [
      totalProducts,
      approvedProducts,
      pendingProducts,
      rejectedProducts,
      totalReviews,
      averageRating,
      totalMessages
    ] = await Promise.all([
      prisma.product.count({
        where: { sellerId: userId }
      }),
      prisma.product.count({
        where: { 
          sellerId: userId,
          isApproved: true
        }
      }),
      prisma.product.count({
        where: { 
          sellerId: userId,
          isApproved: false
        }
      }),
      prisma.product.count({
        where: { 
          sellerId: userId,
          isActive: false
        }
      }),
      prisma.review.count({
        where: { userId }
      }),
      prisma.review.aggregate({
        where: { userId },
        _avg: {
          rating: true
        }
      }),
      prisma.contactMessage.count({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      })
    ])

    return res.json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          approved: approvedProducts,
          pending: pendingProducts,
          rejected: rejectedProducts
        },
        reviews: {
          total: totalReviews,
          averageRating: averageRating._avg.rating || 0
        },
        messages: {
          total: totalMessages
        }
      }
    })
  } catch (error) {
    console.error('Error getting user stats:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get user statistics'
    })
  }
} 