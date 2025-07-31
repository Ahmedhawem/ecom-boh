import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { CreateUserInput, LoginInput, AuthResponse, UserWithoutPassword } from '@/types'
import { AppError } from '@/middleware/errorHandler'
import { isValidEmail, isStrongPassword } from '@/utils/database'

export class AuthService {
  // Generate JWT token
  private static generateToken(user: UserWithoutPassword): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    }

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    })
  }

  // Register new user
  static async register(userData: CreateUserInput): Promise<AuthResponse> {
    try {
      // Validate email format
      if (!isValidEmail(userData.email)) {
        throw new AppError('Format d\'email invalide', 400)
      }

      // Validate password strength
      if (!isStrongPassword(userData.password)) {
        throw new AppError(
          'Le mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule et un chiffre',
          400
        )
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (existingUser) {
        throw new AppError('Un utilisateur avec cet email existe déjà', 409)
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds)

      // Create user
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          role: userData.role || 'BUYER',
        },
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
        },
      })

      // Generate token
      const token = this.generateToken(user)

      return {
        user,
        token,
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Erreur lors de l\'inscription', 500)
    }
  }

  // Login user
  static async login(loginData: LoginInput): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          address: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user) {
        throw new AppError('Email ou mot de passe incorrect', 401)
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError('Compte désactivé', 401)
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.password)

      if (!isPasswordValid) {
        throw new AppError('Email ou mot de passe incorrect', 401)
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = user

      // Generate token
      const token = this.generateToken(userWithoutPassword)

      return {
        user: userWithoutPassword,
        token,
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Erreur lors de la connexion', 500)
    }
  }

  // Get current user
  static async getCurrentUser(userId: string): Promise<UserWithoutPassword> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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
        },
      })

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404)
      }

      if (!user.isActive) {
        throw new AppError('Compte désactivé', 401)
      }

      return user
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Erreur lors de la récupération du profil', 500)
    }
  }

  // Update user profile
  static async updateProfile(
    userId: string,
    updateData: {
      firstName?: string
      lastName?: string
      phone?: string
      address?: string
      avatar?: string
    }
  ): Promise<UserWithoutPassword> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
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
        },
      })

      return user
    } catch (error) {
      throw new AppError('Erreur lors de la mise à jour du profil', 500)
    }
  }

  // Change password
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      })

      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404)
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)

      if (!isCurrentPasswordValid) {
        throw new AppError('Mot de passe actuel incorrect', 400)
      }

      // Validate new password strength
      if (!isStrongPassword(newPassword)) {
        throw new AppError(
          'Le nouveau mot de passe doit contenir au moins 8 caractères, une minuscule, une majuscule et un chiffre',
          400
        )
      }

      // Hash new password
      const saltRounds = 12
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      })

      return { message: 'Mot de passe modifié avec succès' }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Erreur lors du changement de mot de passe', 500)
    }
  }

  // Verify token
  static async verifyToken(token: string): Promise<UserWithoutPassword> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
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
        },
      })

      if (!user || !user.isActive) {
        throw new AppError('Token invalide', 401)
      }

      return user
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Token invalide', 401)
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expiré', 401)
      }
      throw new AppError('Erreur de vérification du token', 500)
    }
  }

  // Refresh token
  static async refreshToken(userId: string): Promise<{ token: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      })

      if (!user || !user.isActive) {
        throw new AppError('Utilisateur non trouvé ou désactivé', 401)
      }

      const token = this.generateToken(user)

      return { token }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Erreur lors du renouvellement du token', 500)
    }
  }

  // Admin: Get all users
  static async getAllUsers(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
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
                orders: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
      ])

      const totalPages = Math.ceil(total / limit)

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }
    } catch (error) {
      throw new AppError('Erreur lors de la récupération des utilisateurs', 500)
    }
  }

  // Admin: Update user status
  static async updateUserStatus(userId: string, isActive: boolean): Promise<UserWithoutPassword> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { isActive },
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
        },
      })

      return user
    } catch (error) {
      throw new AppError('Erreur lors de la mise à jour du statut utilisateur', 500)
    }
  }

  // Admin: Update user role
  static async updateUserRole(userId: string, role: string): Promise<UserWithoutPassword> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: role as any },
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
        },
      })

      return user
    } catch (error) {
      throw new AppError('Erreur lors de la mise à jour du rôle utilisateur', 500)
    }
  }
} 