"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null) // null, 'success', 'error'

  const email = searchParams.get("email")
  const token = searchParams.get("token")

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // If there's a token in the URL, attempt to verify the email automatically
  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken) => {
    setIsVerifying(true)
    try {
      const response = await axios.post(
        `${API_BASE}/api/auth/verify-email/${verificationToken}/`,
      )

      if (response.data.success) {
        setVerificationStatus("success")
        toast.success("Email verified successfully!", {
          description: "You can now log in to your account.",
        })
      } else {
        throw new Error(response.data.message || "Verification failed")
      }
    } catch (error) {
      console.error("Email verification failed:", error)
      setVerificationStatus("error")
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || "Email verification failed."
      toast.error("Verification Failed", {
        description: errorMessage,
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const resendVerificationEmail = async () => {
    if (!email) {
      toast.error("Email address not found. Please try registering again.")
      return
    }

    setIsResending(true)
    try {
      const response = await axios.post(`${API_BASE}/api/auth/resend-verification/`, {
        email: email,
      })

      if (response.data.success) {
        toast.success("Verification email sent!", {
          description: "Please check your inbox for the new verification link.",
        })
      } else {
        throw new Error(response.data.message || "Failed to resend verification email")
      }
    } catch (error) {
      console.error("Failed to resend verification email:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.detail || "Failed to resend verification email."
      toast.error("Resend Failed", {
        description: errorMessage,
      })
    } finally {
      setIsResending(false)
    }
  }

  // If verification was successful
  if (verificationStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-green-200 bg-green-50 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">Email Verified Successfully!</CardTitle>
              <CardDescription className="text-green-700">
                Your email address has been verified. You can now log in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full">
                <Link href="/auth">Continue to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If verification failed
  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-red-200 bg-red-50 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-800">Verification Failed</CardTitle>
              <CardDescription className="text-red-700">
                The verification link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {email && (
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResending}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // If currently verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <CardTitle>Verifying Your Email</CardTitle>
              <CardDescription>Please wait while we verify your email address...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  // Default state - waiting for email verification
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to {email ? <strong>{email}</strong> : "your email address"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                <strong>Next steps:</strong>
                <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to log in to your account</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {email && (
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResending}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              )}

              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth">I've verified my email - Log in</Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Wrong email address?{" "}
              <Link href="/auth" className="underline">
                Register again
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
