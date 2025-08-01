import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get admin dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      pendingProducts,
      recentOrders,
      topProducts,
      userStats
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.category.count(),
      
      // Pending products
      prisma.product.count({
        where: { isApproved: false }
      }),
      
      // Recent orders (last 7 days)
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          product: {
            select: {
              title: true,
              price: true
            }
          },
          buyer: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      // Top products by reviews
      prisma.product.findMany({
        include: {
          reviews: true,
          category: true,
          seller: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          reviews: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      
      // User statistics by role
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      })
    ])

    // Calculate revenue from recent orders
    const totalRevenue = recentOrders.reduce((sum, order) => {
      return sum + Number(order.totalPrice)
    }, 0)

    // Calculate average rating for top products
    const topProductsWithRating = topProducts.map(product => {
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
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        pendingProducts,
        totalRevenue,
        recentOrders,
        topProducts: topProductsWithRating,
        userStats
      }
    })
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics'
    })
  }
}

// Get all users with pagination and filtering
export const getAllUsersAdmin = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

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
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy as string] = sortOrder

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          address: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              products: true,
              reviews: true,
              orders: true
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.user.count({ where })
    ])

    res.json({
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
    console.error('Error getting all users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    })
  }
}

// Get all products with admin filters
export const getAllProductsAdmin = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      status,
      seller,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {}
    
    if (category) {
      where.categoryId = category as string
    }
    
    if (status) {
      where.isApproved = status === 'approved'
    }
    
    if (seller) {
      where.sellerId = seller as string
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ]
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
              email: true
            }
          },
          reviews: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true
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
    console.error('Error getting all products:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get products'
    })
  }
}

// Approve or reject a product
export const updateProductApproval = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { isApproved, reason } = req.body

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            email: true,
            firstName: true,
            lastName: true
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

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isApproved },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: updatedProduct,
      message: isApproved ? 'Product approved successfully' : 'Product rejected successfully'
    })
  } catch (error) {
    console.error('Error updating product approval:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update product approval'
    })
  }
}

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { role } = req.body

    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        address: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
            reviews: true,
            orders: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: updatedUser,
      message: 'User role updated successfully'
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    })
  }
}

// Toggle user active status
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        address: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            products: true,
            reviews: true,
            orders: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: updatedUser,
      message: updatedUser.isActive ? 'User activated successfully' : 'User deactivated successfully'
    })
  } catch (error) {
    console.error('Error toggling user status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to toggle user status'
    })
  }
}

// Get all categories with admin functionality
export const getAllCategoriesAdmin = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    // Build order by clause
    const orderBy: any = {}
    orderBy[sortBy as string] = sortOrder

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.category.count({ where })
    ])

    res.json({
      success: true,
      data: categories,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Error getting all categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    })
  }
}

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body

    const existingCategory = await prisma.category.findUnique({
      where: { name }
    })

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      })
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        image
      }
    })

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    })
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create category'
    })
  }
}

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, image, isActive } = req.body

    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Check if name is being changed and if it conflicts
    if (name && name !== category.name) {
      const existingCategory = await prisma.category.findUnique({
        where: { name }
      })

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        })
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        image,
        isActive
      }
    })

    res.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    })
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update category'
    })
  }
}

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    if (category._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      })
    }

    await prisma.category.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    })
  }
} 