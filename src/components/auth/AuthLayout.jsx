"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import LoginImage from "@/assets/images/auth/loginImage.png"

export default function AuthLayout() {
  const router = useRouter()

  // Form states - maintaining existing structure
  const [isSignUp, setIsSignUp] = useState(false)
  const [userType, setUserType] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form data - updated to match API requirements
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
    role: "student",
  })

  // Form validation errors
  const [errors, setErrors] = useState({})

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const validateForm = () => {
    console.log("🔍 AuthLayout: Starting form validation...")
    console.log("📝 AuthLayout: Form data to validate:", {
      ...formData,
      password: "[HIDDEN]",
      password_confirm: "[HIDDEN]",
    })

    const newErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      newErrors.email = "Email is required"
      console.log("❌ AuthLayout: Email validation failed - empty")
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
      console.log("❌ AuthLayout: Email validation failed - invalid format:", formData.email)
    } else {
      console.log("✅ AuthLayout: Email validation passed")
    }

    // Username validation (for sign up)
    if (isSignUp) {
      if (!formData.username) {
        newErrors.username = "Username is required"
        console.log("❌ AuthLayout: Username validation failed - empty")
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters"
        console.log("❌ AuthLayout: Username validation failed - too short:", formData.username.length)
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores"
        console.log("❌ AuthLayout: Username validation failed - invalid characters")
      } else {
        console.log("✅ AuthLayout: Username validation passed")
      }

      // First name validation
      if (!formData.first_name) {
        newErrors.first_name = "First name is required"
        console.log("❌ AuthLayout: First name validation failed - empty")
      } else if (formData.first_name.trim().length < 2) {
        newErrors.first_name = "First name must be at least 2 characters"
        console.log("❌ AuthLayout: First name validation failed - too short")
      } else {
        console.log("✅ AuthLayout: First name validation passed")
      }

      // Last name validation
      if (!formData.last_name) {
        newErrors.last_name = "Last name is required"
      } else if (formData.last_name.trim().length < 2) {
        newErrors.last_name = "Last name must be at least 2 characters"
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation (only for sign up)
    if (isSignUp) {
      if (!formData.password_confirm) {
        newErrors.password_confirm = "Please confirm your password"
        console.log("❌ AuthLayout: Password confirmation validation failed - empty")
      } else if (formData.password !== formData.password_confirm) {
        newErrors.password_confirm = "Passwords do not match"
        console.log("❌ AuthLayout: Password confirmation validation failed - mismatch")
      } else {
        console.log("✅ AuthLayout: Password confirmation validation passed")
      }
    }

    setErrors(newErrors)
    const isValid = Object.keys(newErrors).length === 0
    console.log(`${isValid ? "✅" : "❌"} AuthLayout: Form validation ${isValid ? "passed" : "failed"}`)

    if (!isValid) {
      console.log("📋 AuthLayout: Validation errors:", newErrors)
    }

    return isValid
  }

  /**
   * Enhanced input change handler with logging
   */
  const handleInputChange = (field, value) => {
    console.log(
      `📝 AuthLayout: Input changed - ${field}:`,
      field === "password" || field === "password_confirm" ? "[HIDDEN]" : value,
    )

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      console.log(`🧹 AuthLayout: Clearing error for field: ${field}`)
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  /**
   * Enhanced form submission handler with comprehensive logging
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("🚀 AuthLayout: Form submission started")
    console.log("📋 AuthLayout: Submission type:", isSignUp ? "SIGN_UP" : "SIGN_IN")
    console.log("👤 AuthLayout: User type:", userType)

    if (!validateForm()) {
      console.log("❌ AuthLayout: Form validation failed, aborting submission")
      toast.error("Please fix the errors before submitting")
      return
    }

    setLoading(true)
    console.log("⏳ AuthLayout: Setting loading state to true")

    try {
      console.log("🌐 AuthLayout: API host:", API_BASE)
      const endpoint = isSignUp ? `${API_BASE}/api/auth/register/` : `${API_BASE}/api/auth/login/`
      console.log("📡 AuthLayout: API endpoint:", endpoint)

      // Prepare request body with user type included
      const requestBody = {
        ...formData,
        role: userType, // Ensure user type is included in the request
      }

      // For login, we only need email and password
      if (!isSignUp) {
        const loginBody = {
          email: formData.email,
          password: formData.password,
        }

        console.log("📡 AuthLayout: Sending login request...")
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginBody),
        })

        console.log("📥 AuthLayout: Login response status:", response.status)
        const data = await response.json()
        console.log("📄 AuthLayout: Login response data:", data)

        if (response.ok && data.success) {
          console.log("✅ AuthLayout: Login successful")
          handleSuccessfulAuth(data, false)
        } else {
          console.error("❌ AuthLayout: Login failed:", data)
          handleAuthError(data)
        }
      } else {
        console.log("📡 AuthLayout: Sending sign up request...")
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        console.log("📥 AuthLayout: Sign up response status:", response.status)
        const data = await response.json()
        console.log("📄 AuthLayout: Sign up response data:", data)

        if (response.ok && data.success) {
          console.log("✅ AuthLayout: Sign up successful")
          handleSuccessfulAuth(data, true)
        } else {
          console.error("❌ AuthLayout: Sign up failed:", data)
          handleAuthError(data)
        }
      }
    } catch (error) {
      console.error("❌ AuthLayout: Network/fetch error:", error)

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        console.error("🌐 AuthLayout: Network connectivity issue")
        toast.error("Unable to connect to server. Please check your internet connection.")
      } else {
        console.error("🔥 AuthLayout: Unexpected error during authentication")
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
      console.log("🏁 AuthLayout: Form submission completed, loading state reset")
    }
  }

  /**
   * Helper function to handle successful authentication
   */
  const handleSuccessfulAuth = (data, isRegistration) => {
    console.log("🎉 AuthLayout: Processing successful authentication")

    if (isRegistration) {
      // For registration, redirect to verify email page
      toast.success("Registration successful! Please check your email for verification.")
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`)
      return
    }

    // For login, store tokens and user data
    if (data?.data?.access_token && data?.data?.refresh_token) {
      console.log("💾 AuthLayout: Storing authentication tokens")
      localStorage.setItem("access_token", data.data.access_token)
      localStorage.setItem("refresh_token", data.data.refresh_token)
    } else {
      console.warn("⚠️ AuthLayout: No tokens received in response")
    }

    // Store user data
    const userData = data.data.user
    console.log("💾 AuthLayout: Storing user data:", userData)
    localStorage.setItem("user_data", JSON.stringify(userData))

    toast.success("Welcome back!")

    // Redirect based on user role
    // const redirectPath = userData.role === "teacher" ? "/tutor/dashboard" : "/student/dashboard"
    const redirectPath = "/profile"
    console.log("🚀 AuthLayout: Redirecting to:", redirectPath)
    router.push(redirectPath)
  }

  /**
   * Helper function to handle authentication errors
   */
  const handleAuthError = (data) => {
    console.log("🔍 AuthLayout: Processing authentication error")

    // Handle specific error messages
    const errorMessage =
      data.message ||
      data.error ||
      data.detail ||
      (data.non_field_errors && data.non_field_errors[0]) ||
      "Authentication failed"

    console.log("📢 AuthLayout: Error message to display:", errorMessage)

    // Handle field-specific errors
    if (data.errors || data.field_errors) {
      const fieldErrors = data.errors || data.field_errors
      console.log("📋 AuthLayout: Field-specific errors:", fieldErrors)
      setErrors(fieldErrors)
    }

    // Check for email verification error
    if (errorMessage.toLowerCase().includes("verify") || errorMessage.toLowerCase().includes("verification")) {
      toast.error("Email not verified", {
        description: "Please check your email and verify your account before logging in.",
      })
    } else {
      toast.error(errorMessage)
    }
  }

  /**
   * Enhanced user type change handler
   */
  const handleUserTypeChange = (newUserType) => {
    console.log("🔄 AuthLayout: User type changed from", userType, "to", newUserType)
    setUserType(newUserType)
    setFormData((prev) => ({
      ...prev,
      role: newUserType,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="p-8 lg:p-12">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                  <Image src="/logo.png" alt="Pen Tutor Logo" className="w-36" width={144} height={40} />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-gray-600">{isSignUp ? "Join our learning community" : "Sign in to your account"}</p>
              </div>

              {/* User Type Selection - Only show during signup */}
              {isSignUp && (
                <Tabs value={userType} onValueChange={handleUserTypeChange} className="w-full mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="student"
                      className="data-[state=active]:bg-secondary data-[state=active]:text-white"
                    >
                      Student
                    </TabsTrigger>
                    <TabsTrigger
                      value="teacher"
                      className="data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      Teacher
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )}

              {/* Error Display */}
              {errors.general && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Sign Up Fields */}
                {isSignUp && (
                  <>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className={errors.username ? "border-red-500" : ""}
                        disabled={loading}
                      />
                      {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          placeholder="Enter your first name"
                          value={formData.first_name}
                          onChange={(e) => handleInputChange("first_name", e.target.value)}
                          className={errors.first_name ? "border-red-500" : ""}
                          disabled={loading}
                        />
                        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                      </div>

                      <div>
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          placeholder="Enter your last name"
                          value={formData.last_name}
                          onChange={(e) => handleInputChange("last_name", e.target.value)}
                          className={errors.last_name ? "border-red-500" : ""}
                          disabled={loading}
                        />
                        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                      </div>
                    </div>
                  </>
                )}

                {/* Common Fields */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={loading}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password for Sign Up */}
                {isSignUp && (
                  <div>
                    <Label htmlFor="password_confirm">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="password_confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.password_confirm}
                        onChange={(e) => handleInputChange("password_confirm", e.target.value)}
                        className={errors.password_confirm ? "border-red-500" : ""}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password_confirm && <p className="text-red-500 text-sm mt-1">{errors.password_confirm}</p>}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${
                    userType === "student" ? "bg-secondary hover:bg-secondary" : "bg-primary hover:bg-primary"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </>
                  ) : isSignUp ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <Button
                    variant="link"
                    onClick={() => {
                      console.log(
                        "🔄 AuthLayout: Switching form mode from",
                        isSignUp ? "sign up" : "sign in",
                        "to",
                        isSignUp ? "sign in" : "sign up",
                      )
                      setIsSignUp(!isSignUp)
                      setErrors({}) // Clear errors when switching modes
                    }}
                    className={`p-0 ${userType === "student" ? "text-secondary" : "text-primary"}`}
                    disabled={loading}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Button>
                </p>
              </div>
            </div>

            {/* Right Side - Image */}
            <div
              className={`relative overflow-hidden rounded-r-2xl ${
                userType === "student"
                  ? "bg-gradient-to-br from-secondary/90 to-secondary"
                  : "bg-gradient-to-br from-primary/90 to-primary"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={LoginImage}
                  alt="Learning Community"
                  width={350}
                  height={400}
                  className="object-contain max-w-[350px] max-h-[400px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
