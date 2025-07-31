import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get reviews for a product
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params
    const { page = 1, limit = 10 } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          productId
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.review.count({
        where: {
          productId
        }
      })
    ])

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error getting product reviews:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get product reviews'
    })
  }
}

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params
    const { rating, comment } = req.body
    const userId = (req as any).user.id

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId
      }
    })

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      })
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        productId,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    // Note: Product model doesn't have averageRating field, so we calculate it on-the-fly
    // The average rating will be calculated when fetching products

    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create review'
    })
  }
}

// Update a review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { rating, comment } = req.body
    const userId = (req as any).user.id

    // Check if review exists and user owns it
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        product: true
      }
    })

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    if (existingReview.userId !== userId && (req as any).user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      })
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: parseInt(rating),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    return res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update review'
    })
  }
}

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id

    // Check if review exists and user owns it
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        product: true
      }
    })

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    if (existingReview.userId !== userId && (req as any).user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      })
    }

    // Delete the review
    await prisma.review.delete({
      where: { id }
    })

    // Note: Product model doesn't have averageRating field, so we calculate it on-the-fly
    // The average rating will be calculated when fetching products

    return res.json({
      success: true,
      message: 'Review deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    })
  }
}

// Get user's reviews
export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 10 } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          userId
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.review.count({
        where: {
          userId
        }
      })
    ])

    return res.json({
      success: true,
      data: reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error getting user reviews:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get user reviews'
    })
  }
} 