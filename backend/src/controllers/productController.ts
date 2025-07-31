import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { uploadToCloudinary } from '@/utils/cloudinary'

const prisma = new PrismaClient()

// Get all products with pagination and filtering
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status = 'approved'
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {
      isApproved: status === 'approved'
    }

    if (category) {
      where.categoryId = category as string
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice as string)
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string)
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy as string] = sortOrder

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true
            }
          },
          reviews: {
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
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      return {
        ...product,
        averageRating: avgRating,
        reviewCount: product.reviews.length
      }
    })

    res.json({
      success: true,
      data: productsWithRating,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error getting products:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get products'
    })
  }
}

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            products: {
              where: {
                id: { not: id },
                isApproved: true
              },
              take: 4
            }
          }
        },
        reviews: {
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
        }
      }
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0

    const productWithRating = {
      ...product,
      averageRating: avgRating,
      reviewCount: product.reviews.length
    }

    return res.json({
      success: true,
      data: productWithRating
    })
  } catch (error) {
    console.error('Error getting product:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get product'
    })
  }
}

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, price, categoryId, stock, images } = req.body
    const sellerId = (req as any).user.id

    // Upload images to Cloudinary if provided
    let uploadedImages: string[] = []
    if (images && Array.isArray(images)) {
      for (const image of images) {
        try {
          const result = await uploadToCloudinary(image)
          uploadedImages.push(result.secure_url)
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        sellerId,
        stock: parseInt(stock) || 0,
        images: uploadedImages,
        isApproved: false // Products start as pending approval
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully and pending approval',
      data: product
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    })
  }
}

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, description, price, categoryId, stock, images } = req.body
    const userId = (req as any).user.id
    const userRole = (req as any).user.role

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Check if user can update this product
    if (userRole !== 'ADMIN' && existingProduct.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      })
    }

    // Upload new images to Cloudinary if provided
    let uploadedImages: string[] = existingProduct.images
    if (images && Array.isArray(images)) {
      uploadedImages = []
      for (const image of images) {
        try {
          const result = await uploadToCloudinary(image)
          uploadedImages.push(result.secure_url)
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        stock: parseInt(stock) || 0,
        images: uploadedImages,
        isApproved: false // Reset approval status when updated
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    return res.json({
      success: true,
      message: 'Product updated successfully and pending approval',
      data: product
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update product'
    })
  }
}

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.id
    const userRole = (req as any).user.role

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Check if user can delete this product
    if (userRole !== 'ADMIN' && existingProduct.sellerId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      })
    }

    await prisma.product.delete({
      where: { id }
    })

    return res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    })
  }
}

// Get products by user
export const getProductsByUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 12 } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { sellerId: userId },
        include: {
          category: true,
          reviews: {
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
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.product.count({ where: { sellerId: userId } })
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      return {
        ...product,
        averageRating: avgRating,
        reviewCount: product.reviews.length
      }
    })

    res.json({
      success: true,
      data: productsWithRating,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error getting user products:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get user products'
    })
  }
}

// Search products
export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { 
      q, 
      page = 1, 
      limit = 12, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {
      isApproved: true
    }

    if (q) {
      where.OR = [
        { title: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.categoryId = category as string
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice as string)
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string)
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy as string] = sortOrder

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true
            }
          },
          reviews: {
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
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      return {
        ...product,
        averageRating: avgRating,
        reviewCount: product.reviews.length
      }
    })

    res.json({
      success: true,
      data: productsWithRating,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to search products'
    })
  }
}

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params
    const { 
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy as string] = sortOrder

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          categoryId,
          isApproved: true
        },
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true
            }
          },
          reviews: {
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
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({
        where: {
          categoryId,
          isApproved: true
        }
      })
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0

      return {
        ...product,
        averageRating: avgRating,
        reviewCount: product.reviews.length
      }
    })

    res.json({
      success: true,
      data: productsWithRating,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error getting products by category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get products by category'
    })
  }
} 