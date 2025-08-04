"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem("access")
            const userData = localStorage.getItem("user")

            if (token && userData) {
                const parsedUser = JSON.parse(userData)

                // Ensure user has a user_type, fallback to 'student' if not available
                if (!parsedUser.user_type && !parsedUser.userType) {
                    console.warn("User type not found, defaulting to student")
                    parsedUser.user_type = "student"
                    parsedUser.userType = "student"
                    localStorage.setItem("user", JSON.stringify(parsedUser))
                }

                setUser(parsedUser)
            }
        } catch (error) {
            console.error("Auth check error:", error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = (userData, tokens) => {
        // Ensure user has a user_type
        const userWithType = {
            ...userData,
            user_type: userData.user_type || userData.userType || "student",
            userType: userData.userType || userData.user_type || "student",
        }

        localStorage.setItem("access", tokens.access)
        localStorage.setItem("refresh", tokens.refresh)
        localStorage.setItem("user", JSON.stringify(userWithType))
        setUser(userWithType)
    }

    const logout = () => {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("user")
        setUser(null)
        router.push("/auth")
    }

    const updateUserType = (userType) => {
        if (user) {
            const updatedUser = {
                ...user,
                user_type: userType,
                userType: userType,
            }
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setUser(updatedUser)
        }
    }

    const value = {
        user,
        login,
        logout,
        updateUserType,
        loading,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
