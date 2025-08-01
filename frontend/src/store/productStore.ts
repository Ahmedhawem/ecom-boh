import { create } from 'zustand'
import { Product, ProductFilters, Category } from '@/services/api'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface ProductState {
  products: Product[]
  categories: Category[]
  currentProduct: Product | null
  filters: ProductFilters
  totalProducts: number
  isLoading: boolean
  error: string | null
}

interface ProductActions {
  // Produits
  fetchProducts: (filters?: ProductFilters) => Promise<void>
  fetchProduct: (id: string) => Promise<void>
  createProduct: (data: FormData) => Promise<void>
  updateProduct: (id: string, data: FormData) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  
  // Catégories
  fetchCategories: () => Promise<void>
  createCategory: (data: Partial<Category>) => Promise<void>
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  
  // Filtres
  setFilters: (filters: Partial<ProductFilters>) => void
  clearFilters: () => void
  
  // État
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentProduct: (product: Product | null) => void
  clearProducts: () => void
}

type ProductStore = ProductState & ProductActions

const useProductStore = create<ProductStore>((set, get) => ({
  // État initial
  products: [],
  categories: [],
  currentProduct: null,
  filters: {},
  totalProducts: 0,
  isLoading: false,
  error: null,

  // Actions pour les produits
  fetchProducts: async (filters?: ProductFilters) => {
    set({ isLoading: true, error: null })
    try {
      const currentFilters = filters || get().filters
      const result = await apiService.getProducts(currentFilters)
      set({
        products: result.products,
        totalProducts: result.total,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors du chargement des produits',
      })
      toast.error(error.message || 'Erreur lors du chargement des produits')
    }
  },

  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const product = await apiService.getProduct(id)
      set({
        currentProduct: product,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors du chargement du produit',
      })
      toast.error(error.message || 'Erreur lors du chargement du produit')
    }
  },

  createProduct: async (data: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const newProduct = await apiService.createProduct(data)
      set((state) => ({
        products: [newProduct, ...state.products],
        isLoading: false,
        error: null,
      }))
      toast.success('Produit créé avec succès !')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la création du produit',
      })
      toast.error(error.message || 'Erreur lors de la création du produit')
    }
  },

  updateProduct: async (id: string, data: FormData) => {
    set({ isLoading: true, error: null })
    try {
      const updatedProduct = await apiService.updateProduct(id, data)
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? updatedProduct : product
        ),
        currentProduct: state.currentProduct?.id === id ? updatedProduct : state.currentProduct,
        isLoading: false,
        error: null,
      }))
      toast.success('Produit mis à jour avec succès !')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la mise à jour du produit',
      })
      toast.error(error.message || 'Erreur lors de la mise à jour du produit')
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await apiService.deleteProduct(id)
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
        isLoading: false,
        error: null,
      }))
      toast.success('Produit supprimé avec succès !')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la suppression du produit',
      })
      toast.error(error.message || 'Erreur lors de la suppression du produit')
    }
  },

  // Actions pour les catégories
  fetchCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const categories = await apiService.getCategories()
      set({
        categories,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors du chargement des catégories',
      })
      toast.error(error.message || 'Erreur lors du chargement des catégories')
    }
  },

  createCategory: async (data: Partial<Category>) => {
    set({ isLoading: true, error: null })
    try {
      const newCategory = await apiService.createCategory(data)
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
        error: null,
      }))
      toast.success('Catégorie créée avec succès !')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la création de la catégorie',
      })
      toast.error(error.message || 'Erreur lors de la création de la catégorie')
    }
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    set({ isLoading: true, error: null })
    try {
      const updatedCategory = await apiService.updateCategory(id, data)
      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === id ? updatedCategory : category
        ),
        isLoading: false,
        error: null,
      }))
      toast.success('Catégorie mise à jour avec succès !')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la mise à jour de la catégorie',
      })
      toast.error(error.message || 'Erreur lors de la mise à jour de la catégorie')
    }
  },

  deleteCategory: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await apiService.deleteCategory(id)
      set((state) => ({
        categories: state.categories.filter((category) => category.id !== id),
        isLoading: false,
        error: null,
      }))
      toast.success('Catégorie supprimée avec succès !')
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Erreur lors de la suppression de la catégorie',
      })
      toast.error(error.message || 'Erreur lors de la suppression de la catégorie')
    }
  },

  // Actions pour les filtres
  setFilters: (filters: Partial<ProductFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }))
  },

  clearFilters: () => {
    set({ filters: {} })
  },

  // Actions pour l'état
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  setCurrentProduct: (product: Product | null) => {
    set({ currentProduct: product })
  },

  clearProducts: () => {
    set({
      products: [],
      currentProduct: null,
      totalProducts: 0,
    })
  },
}))

export default useProductStore 