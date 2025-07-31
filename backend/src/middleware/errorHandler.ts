import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

// Custom error class
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err }
  error.message = err.message

  let statusCode = 500
  let message = 'Erreur interne du serveur'

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user?.id,
  })

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409
        message = 'Un enregistrement avec cette valeur unique existe déjà'
        break
      case 'P2025':
        statusCode = 404
        message = 'Enregistrement non trouvé'
        break
      case 'P2003':
        statusCode = 400
        message = 'Violation de contrainte de clé étrangère'
        break
      case 'P2014':
        statusCode = 400
        message = 'Violation de contrainte unique'
        break
      default:
        statusCode = 400
        message = 'Erreur de base de données'
    }
  }

  // Handle Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    message = 'Données invalides'
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Token invalide'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expiré'
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Données invalides'
  }

  // Handle cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400
    message = 'Format d\'ID invalide'
  }

  // Handle duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    statusCode = 409
    message = 'Un enregistrement avec cette valeur existe déjà'
  }

  // Handle file upload errors
  if (err.message.includes('LIMIT_FILE_SIZE')) {
    statusCode = 400
    message = 'Fichier trop volumineux'
  }

  if (err.message.includes('LIMIT_UNEXPECTED_FILE')) {
    statusCode = 400
    message = 'Type de fichier non autorisé'
  }

  // Handle network errors
  if (err.message.includes('ECONNREFUSED')) {
    statusCode = 503
    message = 'Service temporairement indisponible'
  }

  // Handle timeout errors
  if (err.message.includes('ETIMEDOUT')) {
    statusCode = 408
    message = 'Délai d\'attente dépassé'
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  })
}

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Not found handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route non trouvée - ${req.originalUrl}`, 404)
  next(error)
}

// Method not allowed handler
export const methodNotAllowed = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Méthode ${req.method} non autorisée`, 405)
  next(error)
}

// Rate limit exceeded handler
export const rateLimitExceeded = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError('Trop de requêtes, veuillez réessayer plus tard', 429)
  next(error)
}

// Database connection error handler
export const databaseErrorHandler = (err: Error) => {
  console.error('Database connection error:', err)
  
  if (err.message.includes('ECONNREFUSED')) {
    console.error('❌ Impossible de se connecter à la base de données')
    console.error('Vérifiez que PostgreSQL est démarré et accessible')
  }
  
  if (err.message.includes('ENOTFOUND')) {
    console.error('❌ Nom d\'hôte de base de données introuvable')
    console.error('Vérifiez la configuration DATABASE_URL')
  }
  
  if (err.message.includes('authentication failed')) {
    console.error('❌ Échec d\'authentification à la base de données')
    console.error('Vérifiez les identifiants dans DATABASE_URL')
  }
}

// Graceful shutdown handler
export const gracefulShutdown = (signal: string) => {
  console.log(`\n🛑 Signal ${signal} reçu, arrêt gracieux...`)
  
  // Close database connection
  import('@/lib/prisma').then(({ prisma }) => {
    prisma.$disconnect()
      .then(() => {
        console.log('✅ Connexion à la base de données fermée')
        process.exit(0)
      })
      .catch((err) => {
        console.error('❌ Erreur lors de la fermeture de la base de données:', err)
        process.exit(1)
      })
  })
}

// Setup graceful shutdown listeners
export const setupGracefulShutdown = () => {
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
  })
  
  process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error)
    process.exit(1)
  })
} 