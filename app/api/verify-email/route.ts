import { type NextRequest, NextResponse } from "next/server"

/**
 * Email verification API route
 * In production, integrate with services like:
 * - Abstract API (https://www.abstractapi.com/api/email-verification-validation-api)
 * - ZeroBounce
 * - EmailListVerify
 * - Or use SMTP verification
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { valid: false, message: "Email is required" },
        { status: 400 }
      )
    }

    // Basic email format validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { valid: false, message: "Invalid email format" },
        { status: 200 }
      )
    }

    // Extract domain
    const domain = email.split("@")[1]

    // Check for disposable email domains
    const disposableDomains = [
      "tempmail.com",
      "10minutemail.com",
      "guerrillamail.com",
      "mailinator.com",
      "throwaway.email",
      "temp-mail.org",
      "mohmal.com",
      "fakeinbox.com",
    ]

    if (disposableDomains.some((d) => domain.toLowerCase().includes(d))) {
      return NextResponse.json(
        { valid: false, message: "Disposable email addresses are not allowed" },
        { status: 200 }
      )
    }

    // In production, you would:
    // 1. Check MX records for the domain
    // 2. Use a third-party email verification API
    // 3. Send a verification email and wait for confirmation

    // For now, we'll do a basic DNS check
    // Note: This is a simplified check. Real verification requires:
    // - MX record lookup
    // - SMTP verification
    // - Or a paid email verification service

    // Basic domain validation (check if it's a valid TLD format)
    const tldRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.(?:[a-zA-Z]{2,}|xn--[a-zA-Z0-9]+)$/
    const isValidDomain = tldRegex.test(domain)

    if (!isValidDomain) {
      return NextResponse.json(
        { valid: false, message: "Invalid email domain" },
        { status: 200 }
      )
    }

    // If you have an API key for email verification service, use it here:
    // const apiKey = process.env.EMAIL_VERIFICATION_API_KEY
    // if (apiKey) {
    //   const response = await fetch(`https://api.emailverification.com/verify?email=${email}&api_key=${apiKey}`)
    //   const data = await response.json()
    //   return NextResponse.json(data)
    // }

    // For demo purposes, accept valid format emails
    // In production, always verify through a service
    return NextResponse.json({
      valid: true,
      message: "Email format is valid. Please verify your email through the confirmation link.",
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { valid: false, message: "Error verifying email" },
      { status: 500 }
    )
  }
}

