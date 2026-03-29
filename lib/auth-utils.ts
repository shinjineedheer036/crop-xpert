/**
 * Email validation using RFC 5322 compliant regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email)
}

/**
 * Check if email domain exists (basic check)
 * In production, use a proper email verification API
 */
export async function verifyEmailExists(email: string): Promise<{ valid: boolean; message?: string }> {
  if (!isValidEmail(email)) {
    return { valid: false, message: "Invalid email format" }
  }

  // Extract domain
  const domain = email.split("@")[1]

  // Check for common disposable email domains
  const disposableDomains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "throwaway.email",
  ]

  if (disposableDomains.some((d) => domain.includes(d))) {
    return { valid: false, message: "Disposable email addresses are not allowed" }
  }

  // In production, you would call an email verification API here
  // For now, we'll do a basic DNS check via API route
  try {
    const response = await fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    // If API fails, fall back to format validation only
    console.error("Email verification error:", error)
    return { valid: true } // Allow through if API fails (graceful degradation)
  }
}

/**
 * Password strength validation
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Rate limiting for login attempts
 */
export function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): {
  allowed: boolean
  remainingAttempts: number
  resetTime?: number
} {
  const key = `rate_limit_${identifier}`
  const stored = localStorage.getItem(key)

  if (!stored) {
    const data = {
      attempts: 1,
      firstAttempt: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(data))
    return { allowed: true, remainingAttempts: maxAttempts - 1 }
  }

  const data = JSON.parse(stored)
  const now = Date.now()
  const timeSinceFirstAttempt = now - data.firstAttempt

  if (timeSinceFirstAttempt > windowMs) {
    // Reset window
    const newData = {
      attempts: 1,
      firstAttempt: now,
    }
    localStorage.setItem(key, JSON.stringify(newData))
    return { allowed: true, remainingAttempts: maxAttempts - 1 }
  }

  if (data.attempts >= maxAttempts) {
    const resetTime = data.firstAttempt + windowMs
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime,
    }
  }

  data.attempts++
  localStorage.setItem(key, JSON.stringify(data))

  return {
    allowed: true,
    remainingAttempts: maxAttempts - data.attempts,
  }
}

/**
 * Clear rate limit for an identifier
 */
export function clearRateLimit(identifier: string): void {
  const key = `rate_limit_${identifier}`
  localStorage.removeItem(key)
}

/**
 * Simple password hashing (for demo - in production use bcrypt on server)
 * This is a basic hash - for real security, use bcryptjs or server-side hashing
 */
export async function hashPassword(password: string): Promise<string> {
  // Use Web Crypto API for hashing
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  
  // Add salt (in production, use proper salt generation)
  const salt = "cropxpert_salt_2024" // In production, generate unique salt per user
  const saltedHash = await crypto.subtle.digest("SHA-256", encoder.encode(hashHex + salt))
  const saltedArray = Array.from(new Uint8Array(saltedHash))
  return saltedArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

