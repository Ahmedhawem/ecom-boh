import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                isApproved: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error getting categories:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    })
  }
}

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isApproved: true
              }
            }
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

    return res.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error getting category:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get category'
    })
  }
}

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, image } = req.body

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
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

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create category'
    })
  }
}

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, image } = req.body

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Check if new name conflicts with existing category
    if (name && name !== existingCategory.name) {
      const nameConflict = await prisma.category.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive'
          },
          id: {
            not: id
          }
        }
      })

      if (nameConflict) {
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
        image
      }
    })

    return res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update category'
    })
  }
}

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    // Check if category has products
    if (existingCategory._count.products > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      })
    }

    await prisma.category.delete({
      where: { id }
    })

    return res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    })
  }
}

// Get category with products
export const getCategoryWithProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
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

    const [category, products, total] = await Promise.all([
      prisma.category.findUnique({
        where: { id }
      }),
      prisma.product.findMany({
        where: {
          categoryId: id,
          isApproved: true
        },
        include: {
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
          },
          _count: {
            select: {
              reviews: true,
              orders: true
            }
          }
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({
        where: {
          categoryId: id,
          isApproved: true
        }
      })
    ])

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      })
    }

    const totalPages = Math.ceil(total / limitNum)

    return res.json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      }
    })
  } catch (error) {
    console.error('Error getting category with products:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to get category with products'
    })
  }
} 