// Auth middleware
export {
  authenticate,
  optionalAuth,
  authorize,
  adminOnly,
  sellerOnly,
  buyerOnly,
  adminOrSeller,
  adminOrBuyer,
  checkOwnership,
  verifyToken,
} from './auth'

// Validation middleware
export {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateProductCreation,
  validateProductUpdate,
  validateCategoryCreation,
  validateCategoryUpdate,
  validateReviewCreation,
  validateReviewUpdate,
  validateOrderCreation,
  validateOrderUpdate,
  validateContactMessageCreation,
  validateContactMessageUpdate,
  validateIdParam,
  validatePagination,
  validateProductFilters,
} from './validation'

// Error handling middleware
export {
  errorHandler,
  asyncHandler,
  notFound,
  methodNotAllowed,
  rateLimitExceeded,
  databaseErrorHandler,
  gracefulShutdown,
  setupGracefulShutdown,
  AppError,
} from './errorHandler' 