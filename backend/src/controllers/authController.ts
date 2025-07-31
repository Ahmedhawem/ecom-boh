import { Request, Response } from 'express'
import { AuthService } from '@/services/authService'
import { asyncHandler } from '@/middleware/errorHandler'
import { ApiResponse } from '@/types'

export class AuthController {
  // Register new user
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, role, phone, address } = req.body

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName,
      role,
      phone,
      address,
    })

    const response: ApiResponse = {
      success: true,
      message: 'Inscription réussie',
      data: result,
    }

    res.status(201).json(response)
  })

  // Login user
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const result = await AuthService.login({ email, password })

    const response: ApiResponse = {
      success: true,
      message: 'Connexion réussie',
      data: result,
    }

    res.status(200).json(response)
  })

  // Get current user profile
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id

    const user = await AuthService.getCurrentUser(userId)

    const response: ApiResponse = {
      success: true,
      message: 'Profil récupéré avec succès',
      data: user,
    }

    res.status(200).json(response)
  })

  // Update user profile
  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id
    const { firstName, lastName, phone, address, avatar } = req.body

    const user = await AuthService.updateProfile(userId, {
      firstName,
      lastName,
      phone,
      address,
      avatar,
    })

    const response: ApiResponse = {
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user,
    }

    res.status(200).json(response)
  })

  // Change password
  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id
    const { currentPassword, newPassword } = req.body

    const result = await AuthService.changePassword(userId, currentPassword, newPassword)

    const response: ApiResponse = {
      success: true,
      message: result.message,
    }

    res.status(200).json(response)
  })

  // Refresh token
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id

    const result = await AuthService.refreshToken(userId)

    const response: ApiResponse = {
      success: true,
      message: 'Token renouvelé avec succès',
      data: result,
    }

    res.status(200).json(response)
  })

  // Verify token
  static verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body

    const user = await AuthService.verifyToken(token)

    const response: ApiResponse = {
      success: true,
      message: 'Token valide',
      data: user,
    }

    res.status(200).json(response)
  })

  // Admin: Get all users
  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await AuthService.getAllUsers(page, limit)

    const response: ApiResponse = {
      success: true,
      message: 'Utilisateurs récupérés avec succès',
      data: result,
    }

    res.status(200).json(response)
  })

  // Admin: Update user status
  static updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { isActive } = req.body

    const user = await AuthService.updateUserStatus(id, isActive)

    const response: ApiResponse = {
      success: true,
      message: `Statut utilisateur mis à jour avec succès`,
      data: user,
    }

    res.status(200).json(response)
  })

  // Admin: Update user role
  static updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { role } = req.body

    const user = await AuthService.updateUserRole(id, role)

    const response: ApiResponse = {
      success: true,
      message: `Rôle utilisateur mis à jour avec succès`,
      data: user,
    }

    res.status(200).json(response)
  })

  // Logout (client-side token removal)
  static logout = asyncHandler(async (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      message: 'Déconnexion réussie',
    }

    res.status(200).json(response)
  })
} 