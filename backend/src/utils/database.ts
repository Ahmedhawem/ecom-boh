import { prisma } from '@/lib/prisma'
import { PaginationParams, ProductFilters } from '@/types'

// Pagination helper
export const getPaginationParams = (query: any): PaginationParams => {
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const sortBy = query.sortBy as string || 'createdAt'
  const sortOrder = (query.sortOrder as string) || 'desc'

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    sortBy,
    sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
  }
}

// Product filters helper
export const buildProductFilters = (query: any): ProductFilters => {
  const filters: ProductFilters = {}

  if (query.categoryId) filters.categoryId = query.categoryId as string
  if (query.sellerId) filters.sellerId = query.sellerId as string
  if (query.minPrice) filters.minPrice = parseFloat(query.minPrice as string)
  if (query.maxPrice) filters.maxPrice = parseFloat(query.maxPrice as string)
  if (query.isApproved !== undefined) filters.isApproved = query.isApproved === 'true'
  if (query.isActive !== undefined) filters.isActive = query.isActive === 'true'
  if (query.search) filters.search = query.search as string

  return filters
}

// Build Prisma where clause for products
export const buildProductWhere = (filters: ProductFilters) => {
  const where: any = {
    isActive: true,
  }

  if (filters.categoryId) where.categoryId = filters.categoryId
  if (filters.sellerId) where.sellerId = filters.sellerId
  if (filters.isApproved !== undefined) where.isApproved = filters.isApproved
  if (filters.isActive !== undefined) where.isActive = filters.isActive

  if (filters.minPrice || filters.maxPrice) {
    where.price = {}
    if (filters.minPrice) where.price.gte = filters.minPrice
    if (filters.maxPrice) where.price.lte = filters.maxPrice
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  return where
}

// Calculate pagination info
export const calculatePagination = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  }
}

// Database connection test
export const testDatabaseConnection = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Clean up database connection
export const cleanupDatabase = async () => {
  try {
    await prisma.$disconnect()
    console.log('✅ Database connection closed')
  } catch (error) {
    console.error('❌ Error closing database connection:', error)
  }
}

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

// Format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
  }).format(price)
}

// Calculate average rating
export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

// Generate pagination links
export const generatePaginationLinks = (
  baseUrl: string,
  currentPage: number,
  totalPages: number,
  queryParams: Record<string, string> = {}
) => {
  const links: { page: number; url: string; active: boolean }[] = []

  // Add query parameters to base URL
  const queryString = new URLSearchParams(queryParams).toString()
  const separator = queryString ? '&' : ''

  for (let i = 1; i <= totalPages; i++) {
    // Show first page, last page, current page, and pages around current
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      links.push({
        page: i,
        url: `${baseUrl}?page=${i}${separator}${queryString}`,
        active: i === currentPage,
      })
    } else if (
      i === currentPage - 3 ||
      i === currentPage + 3
    ) {
      // Add ellipsis
      links.push({
        page: i,
        url: '',
        active: false,
      })
    }
  }

  return links
} 