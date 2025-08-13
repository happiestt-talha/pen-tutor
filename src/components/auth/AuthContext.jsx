"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  // Set up axios interceptor to include JWT token in requests
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
  }, [])

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_data")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login/`, credentials)

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed")
      }

      // Extract tokens and user data from the response
      const { access_token, refresh_token, user: userData } = response.data.data

      // Store tokens and user data in localStorage
      localStorage.setItem("access_token", access_token)
      localStorage.setItem("refresh_token", refresh_token)
      localStorage.setItem("user_data", JSON.stringify(userData))

      // Set authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`

      console.log("===============================================")
      console.log("Checking Local Storage:", localStorage.getItem("user_data"))
      console.log("Checking Local Storage:", localStorage.getItem("access_token"))
      console.log("Checking Local Storage:", localStorage.getItem("refresh_token"))
      console.log("===============================================")

      // Update user state
      setUser(userData)

      return userData
    } catch (error) {
      console.error("Login failed:", error)

      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message || error.response.data.detail
        if (errorMessage && errorMessage.toLowerCase().includes("verify")) {
          throw new Error("Please verify your email address before logging in.")
        }
      }

      throw new Error(error.response?.data?.message || error.response?.data?.detail || "Login failed")
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register/`, userData)

      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed")
      }

      // Return the response data (contains user_id, email, username)
      return response.data
    } catch (error) {
      console.error("Registration failed:", error)
      throw new Error(error.response?.data?.message || error.response?.data?.detail || "Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_data")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
