"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children, requiredRole = null }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("access")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          console.log("No token or user data found, redirecting to auth")
          router.push("/auth")
          return
        }

        const parsedUser = JSON.parse(userData)
        console.log("Parsed user:", parsedUser)
        setUser(parsedUser)

        // Check role-based access
        const userType = parsedUser.user_type || parsedUser.userType

        if (requiredRole && userType !== requiredRole) {
          console.log(`User type ${userType} doesn't match required role ${requiredRole}`)
          // Redirect to appropriate dashboard
          if (userType === "tutor") {
            router.push("/tutor/dashboard")
          } else if (userType === "student") {
            router.push("/dashboard")
          } else {
            router.push("/auth")
          }
          return
        }

        setLoading(false)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth")
      }
    }

    checkAuth()
  }, [router, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return children
}
