import { create } from 'zustand'
import { User, Product, Category } from '@/services/api'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalCategories: number
  pendingProducts: number
  totalRevenue: number
  recentOrders: any[]
  topProducts: any[]
  userStats: any[]
}

interface AdminState {
  // Dashboard
  dashboardStats: DashboardStats | null
  isLoadingStats: boolean
  
  // Users
  users: User[]
  usersLoading: boolean
  usersPagination: {
    page: number
    limit: number
    total: number
    pages: number
  } | null
  
  // Products
  adminProducts: Product[]
  productsLoading: boolean
  productsPagination: {
    page: number
    limit: number
    total: number
    pages: number
  } | null
  
  // Categories
  adminCategories: Category[]
  categoriesLoading: boolean
  categoriesPagination: {
    page: number
    limit: number
    total: number
    pages: number
  } | null
  
  // Filters
  userFilters: {
    role?: string
    search?: string
    page: number
    limit: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  
  productFilters: {
    category?: string
    status?: string
    seller?: string
    search?: string
    page: number
    limit: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  
  categoryFilters: {
    search?: string
    page: number
    limit: number
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
}

interface AdminActions {
  // Dashboard
  getDashboardStats: () => Promise<void>
  
  // Users
  getUsers: (filters?: Partial<AdminState['userFilters']>) => Promise<void>
  updateUserRole: (userId: string, role: string) => Promise<void>
  toggleUserStatus: (userId: string) => Promise<void>
  
  // Products
  getAdminProducts: (filters?: Partial<AdminState['productFilters']>) => Promise<void>
  updateProductApproval: (productId: string, isApproved: boolean) => Promise<void>
  
  // Categories
  getAdminCategories: (filters?: Partial<AdminState['categoryFilters']>) => Promise<void>
  createCategory: (data: { name: string; description?: string; image?: string }) => Promise<void>
  updateCategory: (categoryId: string, data: { name?: string; description?: string; image?: string; isActive?: boolean }) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
  
  // Filters
  setUserFilters: (filters: Partial<AdminState['userFilters']>) => void
  setProductFilters: (filters: Partial<AdminState['productFilters']>) => void
  setCategoryFilters: (filters: Partial<AdminState['categoryFilters']>) => void
  
  // Reset
  resetAdminState: () => void
}

type AdminStore = AdminState & AdminActions

const useAdminStore = create<AdminStore>((set, get) => ({
  // Initial state
  dashboardStats: null,
  isLoadingStats: false,
  
  users: [],
  usersLoading: false,
  usersPagination: null,
  
  adminProducts: [],
  productsLoading: false,
  productsPagination: null,
  
  adminCategories: [],
  categoriesLoading: false,
  categoriesPagination: null,
  
  userFilters: {
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  
  productFilters: {
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  
  categoryFilters: {
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  
  // Actions
  getDashboardStats: async () => {
    set({ isLoadingStats: true })
    try {
      const stats = await apiService.getAdminDashboard()
      set({ dashboardStats: stats.data, isLoadingStats: false })
    } catch (error: any) {
      set({ isLoadingStats: false })
      toast.error(error.message || 'Failed to load dashboard statistics')
    }
  },
  
  getUsers: async (filters = {}) => {
    const currentFilters = get().userFilters
    const newFilters = { ...currentFilters, ...filters }
    set({ usersLoading: true, userFilters: newFilters })
    
    try {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
      
      const response = await apiService.getAdminUsers(newFilters)
      set({
        users: response.data,
        usersPagination: response.pagination,
        usersLoading: false
      })
    } catch (error: any) {
      set({ usersLoading: false })
      toast.error(error.message || 'Failed to load users')
    }
  },
  
  updateUserRole: async (userId: string, role: string) => {
    try {
      await apiService.updateUserRole(userId, role)
      toast.success('User role updated successfully')
      get().getUsers() // Refresh users list
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user role')
    }
  },
  
  toggleUserStatus: async (userId: string) => {
    try {
      await apiService.toggleUserStatus(userId)
      toast.success('User status updated successfully')
      get().getUsers() // Refresh users list
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user status')
    }
  },
  
  getAdminProducts: async (filters = {}) => {
    const currentFilters = get().productFilters
    const newFilters = { ...currentFilters, ...filters }
    set({ productsLoading: true, productFilters: newFilters })
    
    try {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
      
      const response = await apiService.getAdminProducts(newFilters)
      set({
        adminProducts: response.data,
        productsPagination: response.pagination,
        productsLoading: false
      })
    } catch (error: any) {
      set({ productsLoading: false })
      toast.error(error.message || 'Failed to load products')
    }
  },
  
  updateProductApproval: async (productId: string, isApproved: boolean) => {
    try {
      await apiService.updateProductApproval(productId, isApproved)
      toast.success(isApproved ? 'Product approved successfully' : 'Product rejected successfully')
      get().getAdminProducts() // Refresh products list
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product approval')
    }
  },
  
  getAdminCategories: async (filters = {}) => {
    const currentFilters = get().categoryFilters
    const newFilters = { ...currentFilters, ...filters }
    set({ categoriesLoading: true, categoryFilters: newFilters })
    
    try {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString())
        }
      })
      
      const response = await apiService.getAdminCategories(newFilters)
      set({
        adminCategories: response.data,
        categoriesPagination: response.pagination,
        categoriesLoading: false
      })
    } catch (error: any) {
      set({ categoriesLoading: false })
      toast.error(error.message || 'Failed to load categories')
    }
  },
  
  createCategory: async (data) => {
    try {
      await apiService.createAdminCategory(data)
      toast.success('Category created successfully')
      get().getAdminCategories() // Refresh categories list
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category')
    }
  },
  
  updateCategory: async (categoryId: string, data) => {
    try {
      await apiService.updateAdminCategory(categoryId, data)
      toast.success('Category updated successfully')
      get().getAdminCategories() // Refresh categories list
    } catch (error: any) {
      toast.error(error.message || 'Failed to update category')
    }
  },
  
  deleteCategory: async (categoryId: string) => {
    try {
      await apiService.deleteAdminCategory(categoryId)
      toast.success('Category deleted successfully')
      get().getAdminCategories() // Refresh categories list
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category')
    }
  },
  
  setUserFilters: (filters) => {
    const currentFilters = get().userFilters
    set({ userFilters: { ...currentFilters, ...filters } })
  },
  
  setProductFilters: (filters) => {
    const currentFilters = get().productFilters
    set({ productFilters: { ...currentFilters, ...filters } })
  },
  
  setCategoryFilters: (filters) => {
    const currentFilters = get().categoryFilters
    set({ categoryFilters: { ...currentFilters, ...filters } })
  },
  
  resetAdminState: () => {
    set({
      dashboardStats: null,
      isLoadingStats: false,
      users: [],
      usersLoading: false,
      usersPagination: null,
      adminProducts: [],
      productsLoading: false,
      productsPagination: null,
      adminCategories: [],
      categoriesLoading: false,
      categoriesPagination: null,
      userFilters: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },
      productFilters: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      },
      categoryFilters: {
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
    })
  }
}))

export default useAdminStore 