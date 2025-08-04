"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import StudentLoginImage from "@/assets/images/auth/std_login.png"


export default function AuthLayout() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [userType, setUserType] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showUserTypeSelection, setShowUserTypeSelection] = useState(false)
  const [pendingAuth, setPendingAuth] = useState(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    userType: "student",
  })
  const [errors, setErrors] = useState({})

  const router = useRouter()
  const host = process.env.NEXT_PUBLIC_API_URL

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation (only for sign up)
    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Full name validation (only for sign up)
    if (isSignUp && formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters"
    }

    // Phone number validation (only for sign up)
    if (isSignUp) {
      const phoneRegex = /^\+?[\d\s-()]{10,}$/
      if (!phoneRegex.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Please enter a valid phone number"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const getUserTypeFromResponse = (data) => {
    // Try multiple possible locations for user type in the response
    const possiblePaths = [
      data.user?.user_type,
      data.user?.userType,
      data.user?.type,
      data.user?.role,
      data.userType,
      data.user_type,
      data.type,
      data.role,
    ]

    for (const path of possiblePaths) {
      if (path && (path === "student" || path === "tutor")) {
        return path
      }
    }

    return null
  }

  const redirectToDefaultDashboard = (selectedUserType = "student") => {
    console.log(`Redirecting to default dashboard for ${selectedUserType}`)

    if (selectedUserType === "tutor") {
      router.push("/tutor/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  const handleUserTypeSelection = async (selectedType) => {
    if (!pendingAuth) return

    try {
      setLoading(true)

      // Store the selected user type in localStorage for future reference
      const updatedUser = {
        ...pendingAuth.user,
        user_type: selectedType,
        userType: selectedType,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Optionally, send the user type to the backend to update the profile
      try {
        await fetch(`${host}api/auth/update-user-type/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${pendingAuth.tokens.access}`,
          },
          body: JSON.stringify({
            user_type: selectedType,
          }),
        })
      } catch (updateError) {
        console.warn("Failed to update user type on backend:", updateError)
        // Continue with local storage approach
      }

      toast.success(`Welcome! You've been set up as a ${selectedType}.`)
      redirectToDefaultDashboard(selectedType)

      // Reset states
      setShowUserTypeSelection(false)
      setPendingAuth(null)
    } catch (error) {
      console.error("Error handling user type selection:", error)
      toast.error("Failed to complete setup. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting")
      return
    }

    setLoading(true)

    try {
      console.log("Attempting authentication with host:", host)
      const endpoint = isSignUp ? `${host}api/auth/register/` : `${host}api/auth/login/`

      const requestBody = {
        ...formData,
        user_type: userType,
      }

      console.log("Request body:", requestBody)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok) {
        // Store tokens immediately
        if (data.tokens?.access && data.tokens?.refresh) {
          localStorage.setItem("access", data.tokens.access)
          localStorage.setItem("refresh", data.tokens.refresh)
        } else {
          console.warn("No tokens received in response")
        }

        // Try to determine user type from response
        const responseUserType = getUserTypeFromResponse(data)
        console.log("Detected user type from response:", responseUserType)

        if (responseUserType) {
          // User type is available - proceed with normal flow
          const userData = {
            ...data.user,
            user_type: responseUserType,
            userType: responseUserType,
          }

          localStorage.setItem("user", JSON.stringify(userData))

          toast.success(isSignUp ? "Account created successfully!" : "Welcome back!")

          console.log(`Redirecting to ${responseUserType} dashboard`)
          redirectToDefaultDashboard(responseUserType)
        } else {
          // User type is not available - show selection interface
          console.log("User type not found in response, showing selection interface")

          setPendingAuth({
            user: data.user || {},
            tokens: data.tokens || {},
          })

          setShowUserTypeSelection(true)
          toast.info("Please select your account type to continue")
        }
      } else {
        console.error("Authentication failed:", data)

        // Handle specific error messages
        const errorMessage =
          data.message ||
          data.error ||
          data.detail ||
          (data.non_field_errors && data.non_field_errors[0]) ||
          "Authentication failed"

        toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Auth error:", error)

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Unable to connect to server. Please check your internet connection.")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUserTypeChange = (newUserType) => {
    setUserType(newUserType)
    setFormData((prev) => ({
      ...prev,
      userType: newUserType,
    }))
  }

  const handleCancelUserTypeSelection = () => {
    setShowUserTypeSelection(false)
    setPendingAuth(null)
    toast.info("Authentication cancelled. Please try again.")
  }

  // Show user type selection interface
  if (showUserTypeSelection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Account Type</h2>
              <p className="text-gray-600">
                We couldn't determine your account type. Please select how you'd like to use Pen Tutor.
              </p>
            </div>

            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your account has been created successfully. Please choose your role to access the appropriate dashboard.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Button
                onClick={() => handleUserTypeSelection("student")}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Continue as Student
              </Button>

              <Button
                onClick={() => handleUserTypeSelection("tutor")}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Continue as Tutor
              </Button>

              <Button
                onClick={handleCancelUserTypeSelection}
                disabled={loading}
                variant="outline"
                className="w-full bg-transparent"
              >
                Cancel
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">You can change this later in your profile settings.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main authentication form
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
                  {/* <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PT</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">PEN TUTOR</span> */}
                  <Image src="/logo.png" alt="PEN TUTOR" className="w-36" width={100} height={100} />
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-gray-600">{isSignUp ? "Join our learning community" : "Sign in to your account"}</p>
              </div>

              {/* User Type Selection */}
              <Tabs value={userType} onValueChange={handleUserTypeChange} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="student"
                    className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                  >
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="tutor" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    Tutor
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Sign Up Fields */}
                {isSignUp && (
                  <>
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                      {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password for Sign Up */}
                {isSignUp && (
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${
                    userType === "student" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
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
                    onClick={() => setIsSignUp(!isSignUp)}
                    className={`p-0 ${userType === "student" ? "text-yellow-600" : "text-blue-600"}`}
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Button>
                </p>
              </div>
            </div>

            {/* Right Side - Image */}
            <div
              className={`relative overflow-hidden rounded-l-2xl ${
                userType === "student"
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                  : "bg-gradient-to-br from-blue-500 to-blue-700"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={StudentLoginImage}
                  alt="Learning Community"
                  width={350}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
