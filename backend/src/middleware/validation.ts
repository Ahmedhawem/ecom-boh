import { Request, Response, NextFunction } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { UserRole } from '@prisma/client'

// Validation result handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array().map(error => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
      })),
    })
  }
  return next()
}

// User validation rules
export const validateUserRegistration = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage('Rôle invalide'),
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s\-\(\)]{8,15}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('L\'adresse ne peut pas dépasser 200 caractères'),
  handleValidationErrors,
]

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis'),
  handleValidationErrors,
]

export const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  body('phone')
    .optional()
    .matches(/^\+?[0-9\s\-\(\)]{8,15}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('L\'adresse ne peut pas dépasser 200 caractères'),
  handleValidationErrors,
]

// Product validation rules
export const validateProductCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Le prix doit être un nombre positif'),
  body('categoryId')
    .isUUID()
    .withMessage('ID de catégorie invalide'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre entier positif'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Les images doivent être un tableau'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('URL d\'image invalide'),
  handleValidationErrors,
]

export const validateProductUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Le prix doit être un nombre positif'),
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('ID de catégorie invalide'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre entier positif'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Les images doivent être un tableau'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('URL d\'image invalide'),
  handleValidationErrors,
]

// Category validation rules
export const validateCategoryCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s&'-]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets, apostrophes et &'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('image')
    .optional()
    .isURL()
    .withMessage('URL d\'image invalide'),
  handleValidationErrors,
]

export const validateCategoryUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s&'-]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets, apostrophes et &'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('image')
    .optional()
    .isURL()
    .withMessage('URL d\'image invalide'),
  handleValidationErrors,
]

// Review validation rules
export const validateReviewCreation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Le commentaire doit contenir entre 10 et 500 caractères'),
  body('productId')
    .isUUID()
    .withMessage('ID de produit invalide'),
  handleValidationErrors,
]

export const validateReviewUpdate = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Le commentaire doit contenir entre 10 et 500 caractères'),
  handleValidationErrors,
]

// Order validation rules
export const validateOrderCreation = [
  body('productId')
    .isUUID()
    .withMessage('ID de produit invalide'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('La quantité doit être un nombre entier positif'),
  body('totalPrice')
    .isFloat({ min: 0.01 })
    .withMessage('Le prix total doit être un nombre positif'),
  handleValidationErrors,
]

export const validateOrderUpdate = [
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La quantité doit être un nombre entier positif'),
  body('totalPrice')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Le prix total doit être un nombre positif'),
  handleValidationErrors,
]

// Contact message validation rules
export const validateContactMessageCreation = [
  body('receiverId')
    .isUUID()
    .withMessage('ID de destinataire invalide'),
  body('subject')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le sujet doit contenir entre 3 et 100 caractères'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Le message doit contenir entre 10 et 1000 caractères'),
  handleValidationErrors,
]

export const validateContactMessageUpdate = [
  body('subject')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le sujet doit contenir entre 3 et 100 caractères'),
  body('message')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Le message doit contenir entre 10 et 1000 caractères'),
  handleValidationErrors,
]

// ID parameter validation
export const validateIdParam = [
  param('id')
    .isUUID()
    .withMessage('ID invalide'),
  handleValidationErrors,
]

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un nombre entier positif'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'price', 'rating'])
    .withMessage('Critère de tri invalide'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Ordre de tri invalide'),
  handleValidationErrors,
]

// Product filters validation
export const validateProductFilters = [
  query('categoryId')
    .optional()
    .isUUID()
    .withMessage('ID de catégorie invalide'),
  query('sellerId')
    .optional()
    .isUUID()
    .withMessage('ID de vendeur invalide'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Prix minimum invalide'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Prix maximum invalide'),
  query('isApproved')
    .optional()
    .isBoolean()
    .withMessage('Valeur isApproved invalide'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('Valeur isActive invalide'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La recherche doit contenir entre 2 et 100 caractères'),
  handleValidationErrors,
]

// Product validation rules
export const validateProduct = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Le prix doit être un nombre positif'),
  body('categoryId')
    .isUUID()
    .withMessage('ID de catégorie invalide'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre entier positif'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Les images doivent être un tableau'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('URL d\'image invalide'),
  handleValidationErrors,
]

// Category validation rules
export const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s&'-]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets, apostrophes et &'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('L\'icône ne peut pas dépasser 50 caractères'),
  handleValidationErrors,
] 