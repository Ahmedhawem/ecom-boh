import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-hot-toast'
import apiService from '@/services/api'
import { Product, ProductFilters, Category, Review, User } from '@/services/api'

// Hook pour les produits
export const useProducts = (filters?: ProductFilters) => {
  return useQuery(
    ['products', filters],
    () => apiService.getProducts(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    }
  )
}

export const useProduct = (id: string) => {
  return useQuery(
    ['product', id],
    () => apiService.getProduct(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  )
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (data: FormData) => apiService.createProduct(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
        toast.success('Produit créé avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de la création du produit')
      },
    }
  )
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: string; data: FormData }) => apiService.updateProduct(id, data),
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries(['products'])
        queryClient.invalidateQueries(['product', id])
        toast.success('Produit mis à jour avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de la mise à jour du produit')
      },
    }
  )
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id: string) => apiService.deleteProduct(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products'])
        toast.success('Produit supprimé avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de la suppression du produit')
      },
    }
  )
}

// Hook pour les catégories
export const useCategories = () => {
  return useQuery(
    ['categories'],
    () => apiService.getCategories(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 20 * 60 * 1000, // 20 minutes
    }
  )
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (data: Partial<Category>) => apiService.createCategory(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories'])
        toast.success('Catégorie créée avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de la création de la catégorie')
      },
    }
  )
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Category> }) => apiService.updateCategory(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories'])
        toast.success('Catégorie mise à jour avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de la mise à jour de la catégorie')
      },
    }
  )
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id: string) => apiService.deleteCategory(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories'])
        toast.success('Catégorie supprimée avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de la suppression de la catégorie')
      },
    }
  )
}

// Hook pour les avis
export const useProductReviews = (productId: string) => {
  return useQuery(
    ['reviews', productId],
    () => apiService.getProductReviews(productId),
    {
      enabled: !!productId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
    }
  )
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ productId, data }: { productId: string; data: { rating: number; comment: string } }) =>
      apiService.createReview(productId, data),
    {
      onSuccess: (_, { productId }) => {
        queryClient.invalidateQueries(['reviews', productId])
        toast.success('Avis ajouté avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de l\'ajout de l\'avis')
      },
    }
  )
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }: { id: string; data: { rating: number; comment: string } }) =>
      apiService.updateReview(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews'])
        toast.success('Avis mis à jour avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de la mise à jour de l\'avis')
      },
    }
  )
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    (id: string) => apiService.deleteReview(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews'])
        toast.success('Avis supprimé avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de la suppression de l\'avis')
      },
    }
  )
}

// Hook pour l'upload d'images
export const useUploadImage = () => {
  return useMutation(
    (file: File) => apiService.uploadImage(file),
    {
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de l\'upload de l\'image')
      },
    }
  )
}

// Hook pour les messages de contact
export const useSendContactMessage = () => {
  return useMutation(
    (data: { productId: string; message: string; phone?: string }) =>
      apiService.sendContactMessage(data),
    {
      onSuccess: () => {
        toast.success('Message envoyé avec succès !')
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erreur lors de l\'envoi du message')
      },
    }
  )
}

// Hook pour les statistiques utilisateur
export const useUserStats = () => {
  return useQuery(
    ['user-stats'],
    () => apiService.getUserStats(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  )
} 