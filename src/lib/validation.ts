/**
 * Frontend Validation Utilities
 * Client-side validation functions for forms
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Validate username format and requirements
   */
  static validateUsername(username: string): ValidationResult {
    const errors: string[] = []

    if (!username || username.trim().length === 0) {
      errors.push('Username is required')
    }

    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long')
    }

    if (username.length > 20) {
      errors.push('Username must be no more than 20 characters long')
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens')
    }

    // Check for reserved usernames
    const reservedUsernames = ['admin', 'root', 'api', 'system', 'null', 'undefined']
    if (reservedUsernames.includes(username.toLowerCase())) {
      errors.push('This username is not available')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = []

    if (!password || password.trim().length === 0) {
      errors.push('Password is required')
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }

    if (password.length > 128) {
      errors.push('Password must be no more than 128 characters long')
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    // Check for common weak passwords
    const weakPasswords = [
      'password', 'password123', '123456789', 'qwerty123',
      '12345678', 'password1', 'admin123', 'welcome123'
    ]
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push('This password is too common. Please choose a stronger password')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate Riot ID format
   */
  static validateRiotId(riotId: string): ValidationResult {
    const errors: string[] = []

    if (!riotId || riotId.trim().length === 0) {
      return { isValid: true, errors: [] } // Optional field
    }

    // Must contain # symbol
    if (!riotId.includes('#')) {
      errors.push('Riot ID must include # symbol (e.g., PlayerName#TAG)')
    }

    const parts = riotId.split('#')
    if (parts.length !== 2) {
      errors.push('Riot ID must have exactly one # symbol')
    } else {
      const [gameName, tagLine] = parts

      // Game name validation
      if (!gameName || gameName.trim().length === 0) {
        errors.push('Game name cannot be empty')
      } else if (gameName.length < 3) {
        errors.push('Game name must be at least 3 characters')
      } else if (gameName.length > 16) {
        errors.push('Game name must be no more than 16 characters')
      }

      // Tag line validation
      if (!tagLine || tagLine.trim().length === 0) {
        errors.push('Tag line cannot be empty')
      } else if (tagLine.length < 3) {
        errors.push('Tag line must be at least 3 characters')
      } else if (tagLine.length > 5) {
        errors.push('Tag line must be no more than 5 characters')
      }

      // Check for valid characters
      if (!/^[a-zA-Z0-9\s]+$/.test(gameName)) {
        errors.push('Game name can only contain letters, numbers, and spaces')
      }

      if (!/^[a-zA-Z0-9]+$/.test(tagLine)) {
        errors.push('Tag line can only contain letters and numbers')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get password strength score (0-4)
   */
  static getPasswordStrength(password: string): number {
    let score = 0

    // Length
    if (password.length >= 8) score++
    if (password.length >= 12) score++

    // Complexity
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++

    // Bonus for very long passwords
    if (password.length >= 16) score++

    return Math.min(score, 4)
  }

  /**
   * Get password strength label
   */
  static getPasswordStrengthLabel(score: number): string {
    switch (score) {
      case 0:
      case 1:
        return 'Weak'
      case 2:
        return 'Fair'
      case 3:
        return 'Good'
      case 4:
        return 'Strong'
      default:
        return 'Weak'
    }
  }

  /**
   * Get password strength color
   */
  static getPasswordStrengthColor(score: number): string {
    switch (score) {
      case 0:
      case 1:
        return 'text-red-400'
      case 2:
        return 'text-yellow-400'
      case 3:
        return 'text-blue-400'
      case 4:
        return 'text-green-400'
      default:
        return 'text-red-400'
    }
  }
}

// Export individual functions for easier import
export const {
  isValidEmail,
  validateUsername,
  validatePassword,
  validateRiotId,
  getPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor
} = ValidationUtils
