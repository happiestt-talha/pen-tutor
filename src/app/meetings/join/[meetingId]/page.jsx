"use client"

import { use, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, RefreshCw, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

/**
 * AutoJoinMeetingPage Component
 *
 * Responsibility:
 * - Automatically joins a meeting using the meetingId from URL params
 * - Handles authentication and meeting validation
 * - Provides user feedback during the join process
 * - Manages error states and retry logic
 * - Redirects to the meeting room on successful join
 *
 * Workflow:
 * 1. Unwraps Next.js 15 params Promise using React.use()
 * 2. Extracts meetingId and optional password from URL
 * 3. Makes POST request to Django backend /api/meetings/join/{meetingId}/
 * 4. On success: Redirects to /meetings/room/{meetingId}
 * 5. On error: Shows retry options and error messaging
 */
export default function AutoJoinMeetingPage({ params }) {
  // Unwrap the params Promise (Next.js 15 requirement)
  const resolvedParams = use(params)
  const { meetingId } = resolvedParams

  const router = useRouter()
  const searchParams = useSearchParams()
  const password = searchParams.get("password")

  // Component state management
  const [joinStatus, setJoinStatus] = useState("joining") // joining, success, error, retrying
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [connectionDetails, setConnectionDetails] = useState(null)

  // Maximum retry attempts before giving up
  const MAX_RETRIES = 3

  /**
   * Main function to join a meeting
   * Handles the API call to Django backend and manages response states
   */
  const joinMeeting = async (isRetry = false) => {
    try {
      if (isRetry) {
        setJoinStatus("retrying")
        setRetryCount((prev) => prev + 1)
      } else {
        setJoinStatus("joining")
      }

      // Get authentication token from localStorage
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication required. Please log in.")
      }

      // Prepare request body with optional password
      const requestBody = {
        meetingId,
        ...(password && { password }),
      }

      // Create AbortController for timeout handling
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      // Make API call to Django backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/meetings/join/${meetingId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Handle specific HTTP error codes
        if (response.status === 404) {
          throw new Error("Meeting not found. Please check the meeting ID.")
        } else if (response.status === 403) {
          throw new Error("Access denied. You don't have permission to join this meeting.")
        } else if (response.status === 410) {
          throw new Error("Meeting has ended or expired.")
        } else if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.")
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Failed to join meeting (${response.status})`)
        }
      }

      // Parse successful response
      const data = await response.json()
      setConnectionDetails(data)
      setJoinStatus("success")

      // Show success message
      toast.success("Successfully joined meeting!")

      // Redirect to meeting room after brief delay
      setTimeout(() => {
        router.push(`/meetings/room/${meetingId}`)
      }, 1500)
    } catch (error) {
      console.error("Join meeting error:", error)

      // Handle different error types
      if (error.name === "AbortError") {
        setError("Connection timeout. Please check your internet connection.")
      } else {
        setError(error.message)
      }

      setJoinStatus("error")
      toast.error(error.message)
    }
  }

  /**
   * Retry logic with exponential backoff
   * Automatically retries failed requests up to MAX_RETRIES times
   */
  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      // Exponential backoff: wait longer between retries
      const delay = Math.pow(2, retryCount) * 1000
      setTimeout(() => {
        joinMeeting(true)
      }, delay)
    } else {
      toast.error("Maximum retry attempts reached. Please try again later.")
    }
  }

  /**
   * Navigate back to dashboard
   */
  const handleGoBack = () => {
    router.push("/dashboard")
  }

  /**
   * Refresh the page to start over
   */
  const handleRefresh = () => {
    window.location.reload()
  }

  // Auto-start join process when component mounts
  useEffect(() => {
    if (meetingId) {
      joinMeeting()
    }
  }, [meetingId])

  // Show loading state while params are being resolved
  if (!meetingId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading meeting details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {joinStatus === "joining" && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
            {joinStatus === "retrying" && <RefreshCw className="h-5 w-5 animate-spin text-orange-600" />}
            {joinStatus === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
            {joinStatus === "error" && <XCircle className="h-5 w-5 text-red-600" />}
            <span>
              {joinStatus === "joining" && "Joining Meeting"}
              {joinStatus === "retrying" && `Retrying... (${retryCount}/${MAX_RETRIES})`}
              {joinStatus === "success" && "Meeting Joined!"}
              {joinStatus === "error" && "Join Failed"}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Joining State */}
          {(joinStatus === "joining" || joinStatus === "retrying") && (
            <div className="text-center space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
              <p className="text-gray-600">
                {joinStatus === "joining" ? "Connecting to meeting..." : "Attempting to reconnect..."}
              </p>
              <p className="text-sm text-gray-500">Meeting ID: {meetingId}</p>
            </div>
          )}

          {/* Success State */}
          {joinStatus === "success" && (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-green-700 font-medium">Successfully joined the meeting!</p>
              <p className="text-sm text-gray-600">Redirecting to meeting room...</p>
              {connectionDetails && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <p>Participants: {connectionDetails.participantCount || 0}</p>
                  <p>Meeting Status: {connectionDetails.status || "Active"}</p>
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {joinStatus === "error" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <p className="text-red-700 font-medium">Failed to join meeting</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {retryCount < MAX_RETRIES && (
                  <Button onClick={handleRetry} className="w-full" variant="default">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry ({retryCount + 1}/{MAX_RETRIES})
                  </Button>
                )}

                <div className="flex space-x-2">
                  <Button onClick={handleGoBack} variant="outline" className="flex-1 bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                  <Button onClick={handleRefresh} variant="outline" className="flex-1 bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Troubleshooting Tips */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded text-left">
                <p className="font-medium mb-1">Troubleshooting:</p>
                <ul className="space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Verify the meeting ID is correct</li>
                  <li>• Ensure you have permission to join</li>
                  <li>• Try refreshing the page</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
