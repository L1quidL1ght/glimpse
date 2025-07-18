// Centralized error handling utilities

export enum ErrorType {
  VALIDATION = 'validation',
  NETWORK = 'network',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  CONFLICT = 'conflict',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  field?: string;
  code?: string;
}

export class AppErrorHandler {
  static createError(
    type: ErrorType, 
    message: string, 
    details?: string, 
    field?: string, 
    code?: string
  ): AppError {
    return { type, message, details, field, code };
  }

  static parseSupabaseError(error: any): AppError {
    const errorMessage = error?.message || 'An unexpected error occurred';
    const errorCode = error?.code;
    const errorDetails = error?.details;

    // Handle specific Supabase error codes
    if (errorCode === '23505') {
      // Unique constraint violation
      if (errorMessage.includes('pin')) {
        return this.createError(
          ErrorType.CONFLICT, 
          'This PIN is already in use by another staff member',
          'Please choose a different 4-digit PIN',
          'pin',
          errorCode
        );
      }
      if (errorMessage.includes('email')) {
        return this.createError(
          ErrorType.CONFLICT,
          'This email address is already registered',
          'Please use a different email address',
          'email',
          errorCode
        );
      }
      if (errorMessage.includes('phone')) {
        return this.createError(
          ErrorType.CONFLICT,
          'This phone number is already associated with another customer',
          'Please check the phone number or update the existing customer',
          'phone',
          errorCode
        );
      }
      return this.createError(
        ErrorType.CONFLICT,
        'This information conflicts with existing data',
        errorDetails,
        undefined,
        errorCode
      );
    }

    if (errorCode === '23503') {
      // Foreign key constraint violation
      return this.createError(
        ErrorType.VALIDATION,
        'Cannot delete this record as it is referenced by other data',
        'Please remove related records first',
        undefined,
        errorCode
      );
    }

    if (errorCode === '42501' || errorMessage.includes('permission')) {
      return this.createError(
        ErrorType.PERMISSION,
        'You do not have permission to perform this action',
        'Please contact an administrator for access',
        undefined,
        errorCode
      );
    }

    if (errorCode === '23514') {
      // Check constraint violation
      return this.createError(
        ErrorType.VALIDATION,
        'The provided data does not meet the required format',
        errorDetails || 'Please check your input and try again',
        undefined,
        errorCode
      );
    }

    if (errorMessage.includes('row-level security')) {
      return this.createError(
        ErrorType.PERMISSION,
        'Access denied',
        'You do not have permission to access this data',
        undefined,
        errorCode
      );
    }

    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return this.createError(
        ErrorType.NETWORK,
        'Network error',
        'Please check your internet connection and try again',
        undefined,
        errorCode
      );
    }

    if (errorMessage.includes('not found') || errorCode === '404') {
      return this.createError(
        ErrorType.NOT_FOUND,
        'The requested data could not be found',
        'The record may have been deleted or moved',
        undefined,
        errorCode
      );
    }

    // Default to unknown error
    return this.createError(
      ErrorType.UNKNOWN,
      errorMessage,
      errorDetails,
      undefined,
      errorCode
    );
  }

  static getToastConfig(error: AppError) {
    const baseConfig = {
      title: this.getErrorTitle(error.type),
      description: error.message,
      variant: 'destructive' as const,
    };

    // Add additional context for certain error types
    if (error.details) {
      baseConfig.description = `${error.message}. ${error.details}`;
    }

    return baseConfig;
  }

  static getErrorTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.VALIDATION:
        return 'Validation Error';
      case ErrorType.NETWORK:
        return 'Connection Error';
      case ErrorType.DATABASE:
        return 'Database Error';
      case ErrorType.AUTHENTICATION:
        return 'Authentication Error';
      case ErrorType.PERMISSION:
        return 'Permission Denied';
      case ErrorType.CONFLICT:
        return 'Data Conflict';
      case ErrorType.NOT_FOUND:
        return 'Not Found';
      default:
        return 'Error';
    }
  }

  static formatFieldError(error: AppError): { field: string; message: string } | null {
    if (error.field) {
      return {
        field: error.field,
        message: error.message
      };
    }
    return null;
  }
}

// Common validation functions
export const ValidationHelpers = {
  validateEmail(email: string): AppError | null {
    if (!email) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Please enter a valid email address',
        'Email must be in format: user@domain.com',
        'email'
      );
    }
    return null;
  },

  validatePhone(phone: string): AppError | null {
    if (!phone) return null;
    
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'Please enter a valid phone number',
        'Phone number must be between 10-15 digits',
        'phone'
      );
    }
    return null;
  },

  validatePin(pin: string): AppError | null {
    if (!pin) {
      return AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'PIN is required',
        'Please enter a 4-digit PIN',
        'pin'
      );
    }

    if (!/^\d{4}$/.test(pin)) {
      return AppErrorHandler.createError(
        ErrorType.VALIDATION,
        'PIN must be exactly 4 digits',
        'Please enter numbers only',
        'pin'
      );
    }
    return null;
  },

  validateRequired(value: string, fieldName: string): AppError | null {
    if (!value || value.trim().length === 0) {
      return AppErrorHandler.createError(
        ErrorType.VALIDATION,
        `${fieldName} is required`,
        `Please enter a ${fieldName.toLowerCase()}`,
        fieldName.toLowerCase()
      );
    }
    return null;
  }
};

// Error boundary helper
export const handleAsyncError = async <T>(
  operation: () => Promise<T>,
  errorContext: string
): Promise<{ data: T | null; error: AppError | null }> => {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    console.error(`${errorContext}:`, error);
    const appError = AppErrorHandler.parseSupabaseError(error);
    return { data: null, error: appError };
  }
};