/**
 * Error types used throughout the application
 */

export interface BackendError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Type guard to check if an object is a BackendError
 */
export function isBackendError(obj: unknown): obj is BackendError {
  return obj !== null && typeof obj === "object" && typeof (obj as BackendError).error === "string";
}