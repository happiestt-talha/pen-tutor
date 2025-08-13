"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'
import Loader from '@/components/shared/Loader'

export default function StartMeetingButton({ tuitionId }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { token } = useAuth()
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const handleStartMeeting = async () => {
    setIsLoading(true)
    toast.info("Attempting to start the meeting...")

    if (!token) {
      toast.error("Authentication error. Please log in again.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(
        `${API_BASE}/api/meetings/start/${tuitionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data && response.data.meetingId) {
        toast.success("Meeting started successfully! Redirecting...")
        router.push(`/meetings/room/${response.data.meetingId}`)
      } else {
        throw new Error("Invalid response from server.")
      }
    } catch (error) {
      console.error("Failed to start meeting:", error)
      toast.error(error.response?.data?.detail || "Could not start the meeting. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleStartMeeting} disabled={isLoading}>
      {isLoading ? (
        <Loader size="sm" />
      ) : (
        <>
          <Video className="mr-2 h-4 w-4" />
          Start Meeting
        </>
      )}
    </Button>
  )
}
