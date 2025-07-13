/**
 * Error types used throughout the application
 */

export interface BackendError {
  error: string;
  code?: string;
  details?: any;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Type guard to check if an object is a BackendError
 */
export function isBackendError(obj: any): obj is BackendError {
  return obj && typeof obj.error === "string";
}