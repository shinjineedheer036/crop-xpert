"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  isValidEmail,
  verifyEmailExists,
  validatePasswordStrength,
  checkRateLimit,
  clearRateLimit,
  hashPassword,
  verifyPassword,
} from "@/lib/auth-utils"
import { Loader2, Shield, AlertCircle } from "lucide-react"

interface StoredUser {
  email: string
  passwordHash: string // Store hashed password, not plain text
  createdAt: string
}

export function LoginForm({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [users, setUsers] = useState<StoredUser[]>(() => {
    try {
      const stored = localStorage.getItem("cropxpert_users")
      if (!stored) return []
      const parsed = JSON.parse(stored)
      // Migrate old format (plain passwords) to new format (hashed)
      return parsed.map((u: any) => {
        if (u.password && !u.passwordHash) {
          // Old format - we'll need to re-hash on next login
          return { ...u, passwordHash: null, oldPassword: u.password }
        }
        return u
      })
    } catch {
      return []
    }
  })

  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpConfirm, setSignUpConfirm] = useState("")
  const [signUpError, setSignUpError] = useState("")
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])

  const [resetEmail, setResetEmail] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    // Check rate limiting
    const rateLimit = checkRateLimit(email.toLowerCase())
    if (!rateLimit.allowed) {
      const minutesLeft = Math.ceil((rateLimit.resetTime! - Date.now()) / 60000)
      setError(
        `Too many login attempts. Please try again in ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}.`
      )
      return
    }

    setIsLoading(true)

    try {
      // Find user
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        setError("Invalid email or password")
        return
      }

      // Verify password
      let passwordValid = false

      if (user.passwordHash) {
        // New format - verify against hash
        passwordValid = await verifyPassword(password, user.passwordHash)
      } else if ((user as any).oldPassword) {
        // Old format - verify plain text and migrate
        if ((user as any).oldPassword === password) {
          const newHash = await hashPassword(password)
          const updatedUsers = users.map((u) =>
            u.email.toLowerCase() === email.toLowerCase()
              ? { ...u, passwordHash: newHash, oldPassword: undefined }
              : u
          )
          setUsers(updatedUsers)
          localStorage.setItem("cropxpert_users", JSON.stringify(updatedUsers))
          passwordValid = true
        }
      }

      if (!passwordValid) {
        setError("Invalid email or password")
        return
      }

      // Clear rate limit on successful login
      clearRateLimit(email.toLowerCase())
      onLogin(email)
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError("")
    setPasswordErrors([])

    if (!signUpEmail || !signUpPassword || !signUpConfirm) {
      setSignUpError("Please fill in all fields")
      return
    }

    // Validate email format
    if (!isValidEmail(signUpEmail)) {
      setSignUpError("Please enter a valid email address")
      return
    }

    // Verify email exists (check format and domain)
    setSignUpLoading(true)
    try {
      const emailVerification = await verifyEmailExists(signUpEmail)
      if (!emailVerification.valid) {
        setSignUpError(emailVerification.message || "Invalid email address")
        setSignUpLoading(false)
        return
      }
    } catch (err) {
      console.error("Email verification error:", err)
      // Continue if API fails (graceful degradation)
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(signUpPassword)
    if (!passwordValidation.valid) {
      setPasswordErrors(passwordValidation.errors)
      setSignUpError("Password does not meet requirements")
      setSignUpLoading(false)
      return
    }

    if (signUpPassword !== signUpConfirm) {
      setSignUpError("Passwords do not match")
      setSignUpLoading(false)
      return
    }

    // Check if user already exists
    if (users.find((u) => u.email.toLowerCase() === signUpEmail.toLowerCase())) {
      setSignUpError("Email already registered")
      setSignUpLoading(false)
      return
    }

    try {
      // Hash password before storing
      const passwordHash = await hashPassword(signUpPassword)

      const newUser: StoredUser = {
        email: signUpEmail,
        passwordHash,
        createdAt: new Date().toISOString(),
      }

      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      localStorage.setItem("cropxpert_users", JSON.stringify(updatedUsers))

      setShowSignUp(false)
      setSignUpEmail("")
      setSignUpPassword("")
      setSignUpConfirm("")
      setEmail(signUpEmail)
      setPassword(signUpPassword)
      setSignUpError("")
      setPasswordErrors([])
    } catch (err) {
      console.error("Sign up error:", err)
      setSignUpError("An error occurred. Please try again.")
    } finally {
      setSignUpLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    setResetSuccess(false)

    if (!resetEmail) {
      setResetError("Please enter your email")
      return
    }

    if (!isValidEmail(resetEmail)) {
      setResetError("Please enter a valid email address")
      return
    }

    setResetLoading(true)

    try {
      // Verify email exists
      const emailVerification = await verifyEmailExists(resetEmail)
      if (!emailVerification.valid) {
        setResetError(emailVerification.message || "Invalid email address")
        setResetLoading(false)
        return
      }

      const userExists = users.find((u) => u.email.toLowerCase() === resetEmail.toLowerCase())
      if (!userExists) {
        setResetError("Email not found in our system")
        setResetLoading(false)
        return
      }

      // In production, send actual reset email here
      // For now, simulate email sending
      setResetSuccess(true)
      setTimeout(() => {
        setShowForgotPassword(false)
        setResetEmail("")
        setResetSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Reset password error:", err)
      setResetError("An error occurred. Please try again.")
    } finally {
      setResetLoading(false)
    }
  }

  // Check password strength as user types
  const handlePasswordChange = (value: string) => {
    setSignUpPassword(value)
    if (value.length > 0) {
      const validation = validatePasswordStrength(value)
      setPasswordErrors(validation.errors)
    } else {
      setPasswordErrors([])
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Background */}
      <div className="flex-1 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="z-10 text-center max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-primary mb-2">🌾 CropXpert</h1>
            <p className="text-lg text-foreground/70">Smart Farming. Sustainable Future.</p>
          </div>

          {/* Login Card */}
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Welcome Back</h2>
            </div>
            <p className="text-sm text-foreground/60 mb-6">Secure login with email verification</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 flex gap-4 text-sm">
              <button
                onClick={() => setShowSignUp(true)}
                className="flex-1 text-accent hover:text-accent/80 font-medium transition-colors"
                disabled={isLoading}
              >
                Sign Up
              </button>
              <button
                onClick={() => setShowForgotPassword(true)}
                className="flex-1 text-accent hover:text-accent/80 font-medium transition-colors"
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Security note */}
          <p className="text-foreground/50 text-xs mt-6">
            🔒 Your data is secured with password hashing and email verification
          </p>
        </div>
      </div>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Create Account
            </DialogTitle>
            <DialogDescription>
              Create a secure account with email verification and strong password requirements.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                disabled={signUpLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={signUpPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={signUpLoading}
              />
              {passwordErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordErrors.map((err, idx) => (
                    <p key={idx} className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {err}
                    </p>
                  ))}
                </div>
              )}
              {signUpPassword.length > 0 && passwordErrors.length === 0 && (
                <p className="mt-2 text-xs text-primary flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Password meets all requirements
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={signUpConfirm}
                onChange={(e) => setSignUpConfirm(e.target.value)}
                disabled={signUpLoading}
              />
            </div>
            {signUpError && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{signUpError}</span>
              </div>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={signUpLoading}>
              {signUpLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Email...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you instructions to reset your password.
            </DialogDescription>
          </DialogHeader>
          {resetSuccess ? (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded text-primary text-center">
              <Shield className="w-5 h-5 mx-auto mb-2" />
              Password reset email sent! Check your inbox for instructions.
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={resetLoading}
                />
              </div>
              {resetError && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={resetLoading}>
                {resetLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Send Reset Email"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
