import { User, Product, Category, Review, Order, ContactMessage, UserRole, OrderStatus } from '@prisma/client'

// User types
export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: UserRole
  phone?: string
  address?: string
  avatar?: string
}

export interface UpdateUserInput {
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  avatar?: string
  isActive?: boolean
}

// Product types
export interface CreateProductInput {
  title: string
  description: string
  price: number
  images?: string[]
  categoryId: string
  sellerId: string
  stock?: number
}

export interface UpdateProductInput {
  title?: string
  description?: string
  price?: number
  images?: string[]
  categoryId?: string
  stock?: number
  isApproved?: boolean
  isActive?: boolean
}

// Category types
export interface CreateCategoryInput {
  name: string
  description?: string
  image?: string
}

export interface UpdateCategoryInput {
  name?: string
  description?: string
  image?: string
  isActive?: boolean
}

// Review types
export interface CreateReviewInput {
  rating: number
  comment?: string
  productId: string
  userId: string
}

export interface UpdateReviewInput {
  rating?: number
  comment?: string
}

// Order types
export interface CreateOrderInput {
  productId: string
  buyerId: string
  quantity: number
  totalPrice: number
}

export interface UpdateOrderInput {
  quantity?: number
  totalPrice?: number
  status?: OrderStatus
}

// Contact Message types
export interface CreateContactMessageInput {
  senderId: string
  receiverId: string
  subject: string
  message: string
}

export interface UpdateContactMessageInput {
  subject?: string
  message?: string
  isRead?: boolean
}

// Auth types
export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  user: UserWithoutPassword
  token: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Query types
export interface ProductFilters {
  categoryId?: string
  sellerId?: string
  minPrice?: number
  maxPrice?: number
  isApproved?: boolean
  isActive?: boolean
  search?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Extended types with relations
export type ProductWithRelations = Product & {
  category: Category
  seller: UserWithoutPassword
  reviews: Review[]
  _count?: {
    reviews: number
    orders: number
  }
}

export type ReviewWithRelations = Review & {
  product: Product
  user: UserWithoutPassword
}

export type OrderWithRelations = Order & {
  product: Product
  buyer: UserWithoutPassword
}

export type CategoryWithRelations = Category & {
  products: Product[]
  _count?: {
    products: number
  }
}

export type UserWithRelations = UserWithoutPassword & {
  products?: Product[]
  reviews?: Review[]
  orders?: Order[]
  sentMessages?: ContactMessage[]
  receivedMessages?: ContactMessage[]
  _count?: {
    products: number
    reviews: number
    orders: number
    sentMessages: number
    receivedMessages: number
  }
} 