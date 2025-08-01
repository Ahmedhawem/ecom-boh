import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import toast from 'react-hot-toast'

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'BUYER' | 'SELLER' | 'ADMIN'
  avatar?: string
  phone?: string
  address?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  categoryId: string
  category: Category
  images: string[]
  sellerId: string
  seller: User
  isApproved: boolean
  isActive: boolean
  stock: number
  averageRating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  productId: string
  userId: string
  user: User
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'BUYER' | 'SELLER'
  phone?: string
  address?: string
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  location?: string
  sortBy?: 'price' | 'date' | 'title'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Configuration Axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Intercepteur pour ajouter le token d'authentification
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        // Gestion du refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken) {
              const response = await this.api.post('/auth/refresh', {
                refreshToken,
              })
              const { token } = response.data.data
              localStorage.setItem('token', token)
              originalRequest.headers.Authorization = `Bearer ${token}`
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            // Refresh token expiré, déconnexion
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
        }

        // Gestion des erreurs générales
        const message = error.response?.data?.message || error.message || 'Une erreur est survenue'
        toast.error(message)
        return Promise.reject(error)
      }
    )
  }

  // Méthodes d'authentification
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return response.data.data!
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    return response.data.data!
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/users/profile')
    return response.data.data!
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.api.put<ApiResponse<User>>('/users/profile', data)
    return response.data.data!
  }

  // Méthodes pour les produits
  async getProducts(filters?: ProductFilters): Promise<{ products: Product[]; total: number }> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }

    const response = await this.api.get<ApiResponse<{ products: Product[]; total: number }>>(
      `/products?${params.toString()}`
    )
    return response.data.data!
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.api.get<ApiResponse<Product>>(`/products/${id}`)
    return response.data.data!
  }

  async createProduct(data: FormData): Promise<Product> {
    const response = await this.api.post<ApiResponse<Product>>('/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data!
  }

  async updateProduct(id: string, data: FormData): Promise<Product> {
    const response = await this.api.put<ApiResponse<Product>>(`/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data!
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`)
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<Category[]> {
    const response = await this.api.get<ApiResponse<Category[]>>('/categories')
    return response.data.data!
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await this.api.post<ApiResponse<Category>>('/categories', data)
    return response.data.data!
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await this.api.put<ApiResponse<Category>>(`/categories/${id}`, data)
    return response.data.data!
  }

  async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`/categories/${id}`)
  }

  // Méthodes pour les avis
  async getProductReviews(productId: string): Promise<Review[]> {
    const response = await this.api.get<ApiResponse<Review[]>>(`/products/${productId}/reviews`)
    return response.data.data!
  }

  async createReview(productId: string, data: { rating: number; comment: string }): Promise<Review> {
    const response = await this.api.post<ApiResponse<Review>>(`/products/${productId}/reviews`, data)
    return response.data.data!
  }

  async updateReview(id: string, data: { rating: number; comment: string }): Promise<Review> {
    const response = await this.api.put<ApiResponse<Review>>(`/reviews/${id}`, data)
    return response.data.data!
  }

  async deleteReview(id: string): Promise<void> {
    await this.api.delete(`/reviews/${id}`)
  }

  // Méthodes pour l'upload d'images
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await this.api.post<ApiResponse<{ url: string }>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data!
  }

  // Méthodes pour les messages de contact
  async sendContactMessage(data: {
    productId: string
    message: string
    phone?: string
  }): Promise<void> {
    await this.api.post('/messages/contact', data)
  }

  // Méthodes pour les statistiques utilisateur
  async getUserStats(): Promise<{
    totalProducts: number
    totalViews: number
    totalFavorites: number
    totalMessages: number
  }> {
    const response = await this.api.get<ApiResponse<any>>('/users/stats')
    return response.data.data!
  }

  // Méthodes pour l'administration
  async getAdminDashboard(): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>('/admin/dashboard')
    return response.data
  }

  async getAdminUsers(filters?: any): Promise<any> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await this.api.get<ApiResponse<any>>(`/admin/users?${params.toString()}`)
    return response.data
  }

  async updateUserRole(userId: string, role: string): Promise<any> {
    const response = await this.api.put<ApiResponse<any>>(`/admin/users/${userId}/role`, { role })
    return response.data
  }

  async toggleUserStatus(userId: string): Promise<any> {
    const response = await this.api.put<ApiResponse<any>>(`/admin/users/${userId}/status`)
    return response.data
  }

  async getAdminProducts(filters?: any): Promise<any> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await this.api.get<ApiResponse<any>>(`/admin/products?${params.toString()}`)
    return response.data
  }

  async updateProductApproval(productId: string, isApproved: boolean): Promise<any> {
    const response = await this.api.put<ApiResponse<any>>(`/admin/products/${productId}/approval`, { isApproved })
    return response.data
  }

  async getAdminCategories(filters?: any): Promise<any> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
    }
    const response = await this.api.get<ApiResponse<any>>(`/admin/categories?${params.toString()}`)
    return response.data
  }

  async createAdminCategory(data: any): Promise<any> {
    const response = await this.api.post<ApiResponse<any>>('/admin/categories', data)
    return response.data
  }

  async updateAdminCategory(categoryId: string, data: any): Promise<any> {
    const response = await this.api.put<ApiResponse<any>>(`/admin/categories/${categoryId}`, data)
    return response.data
  }

  async deleteAdminCategory(categoryId: string): Promise<any> {
    const response = await this.api.delete<ApiResponse<any>>(`/admin/categories/${categoryId}`)
    return response.data
  }
}

// Instance singleton
const apiService = new ApiService()
export default apiService 