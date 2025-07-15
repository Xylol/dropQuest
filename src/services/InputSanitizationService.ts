/**
 * Input Sanitization Service
 * Provides centralized input sanitization and validation for all user inputs
 */

export class InputSanitizationService {
  /**
   * HTML encode a string to prevent XSS attacks
   */
  static htmlEncode(input: string): string {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Remove HTML tags and dangerous characters
   */
  static stripHtml(input: string): string {
    return input
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&[a-zA-Z0-9#]+;/g, "") // Remove HTML entities
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/vbscript:/gi, "") // Remove vbscript: protocol
      .replace(/on\w+\s*=/gi, ""); // Remove event handlers
  }

  /**
   * Sanitize text input (hero names, item names, etc.)
   */
  static sanitizeText(
    input: string,
    options: {
      maxLength?: number;
      allowedChars?: RegExp;
      trim?: boolean;
    } = {}
  ): {
    sanitized: string;
    isValid: boolean;
    error?: string;
  } {
    const {
      maxLength = 100,
      allowedChars = /^[a-zA-Z0-9\s\-_.'"!?()]+$/,
      trim = true,
    } = options;

    if (!input || typeof input !== "string") {
      return {
        sanitized: "",
        isValid: false,
        error: "Input must be a valid string",
      };
    }

    let sanitized = this.stripHtml(input);

    if (trim) {
      sanitized = sanitized.trim();
    }

    if (sanitized.length > maxLength) {
      return {
        sanitized,
        isValid: false,
        error: `Input must be ${maxLength} characters or less`,
      };
    }

    if (sanitized && !allowedChars.test(sanitized)) {
      return {
        sanitized,
        isValid: false,
        error: "Input contains invalid characters",
      };
    }

    if (this.containsSuspiciousContent(sanitized)) {
      return {
        sanitized,
        isValid: false,
        error: "Input contains potentially dangerous content",
      };
    }

    return {
      sanitized,
      isValid: true,
    };
  }

  /**
   * Sanitize numeric input
   */
  static sanitizeNumber(
    input: string | number,
    options: {
      min?: number;
      max?: number;
      integer?: boolean;
    } = {}
  ): {
    sanitized: number;
    isValid: boolean;
    error?: string;
  } {
    const { min = 0, max = Number.MAX_SAFE_INTEGER, integer = false } = options;

    let numValue: number;

    if (typeof input === "string") {
      const cleanInput = input.replace(/[^0-9.-]/g, "");
      numValue = parseFloat(cleanInput);
    } else {
      numValue = input;
    }

    if (isNaN(numValue)) {
      return {
        sanitized: 0,
        isValid: false,
        error: "Input must be a valid number",
      };
    }

    if (integer && !Number.isInteger(numValue)) {
      return {
        sanitized: Math.floor(numValue),
        isValid: false,
        error: "Input must be a whole number",
      };
    }

    if (numValue < min) {
      return {
        sanitized: numValue,
        isValid: false,
        error: `Input must be greater than or equal to ${min}`,
      };
    }

    if (numValue > max) {
      return {
        sanitized: numValue,
        isValid: false,
        error: `Input must be less than or equal to ${max}`,
      };
    }

    return {
      sanitized: numValue,
      isValid: true,
    };
  }

  /**
   * Check for suspicious content that might indicate an attack
   */
  private static containsSuspiciousContent(input: string): boolean {
    const suspiciousPatterns = [
      /script\s*>/i,
      /javascript:/i,
      /vbscript:/i,
      /data:/i,
      /on\w+\s*=/i,
      /<\s*iframe/i,
      /<\s*object/i,
      /<\s*embed/i,
      /<\s*link/i,
      /<\s*meta/i,
      /expression\s*\(/i,
      /url\s*\(/i,
      /import\s*\(/i,
      /eval\s*\(/i,
      /function\s*\(/i,
      /alert\s*\(/i,
      /confirm\s*\(/i,
      /prompt\s*\(/i,
      /document\./i,
      /window\./i,
      /location\./i,
      /\.constructor/i,
      /\.prototype/i,
      /\[\s*['"`]/i, // Bracket notation access
      /\$\{/i, // Template literals
      /\{\{/i, // Template expressions
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(input));
  }

  /**
   * Sanitize hero name specifically
   */
  static sanitizeHeroName(input: string): {
    sanitized: string;
    isValid: boolean;
    error?: string;
  } {
    return this.sanitizeText(input, {
      maxLength: 50,
      allowedChars: /^[a-zA-Z0-9\s\-_.'"!]*$/,
      trim: false,
    });
  }

  /**
   * Sanitize item name specifically
   */
  static sanitizeItemName(input: string): {
    sanitized: string;
    isValid: boolean;
    error?: string;
  } {
    return this.sanitizeText(input, {
      maxLength: 100,
      allowedChars: /^[a-zA-Z0-9\s\-_.'"!?()]*$/,
      trim: false,
    });
  }

  /**
   * Sanitize runs input
   */
  static sanitizeRuns(input: string | number): {
    sanitized: number;
    isValid: boolean;
    error?: string;
  } {
    return this.sanitizeNumber(input, {
      min: 1,
      max: 1000000,
      integer: true,
    });
  }

  /**
   * Sanitize rarity input
   */
  static sanitizeRarity(input: string | number): {
    sanitized: number;
    isValid: boolean;
    error?: string;
  } {
    return this.sanitizeNumber(input, {
      min: 1,
      max: 1000000,
      integer: true,
    });
  }
}
