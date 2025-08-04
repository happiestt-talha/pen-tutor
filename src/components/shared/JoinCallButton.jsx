"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Video, Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function JoinCallButton({ session, onJoinCall }) {
  const [timeUntilSession, setTimeUntilSession] = useState(null)
  const [canJoin, setCanJoin] = useState(false)
  const [sessionStatus, setSessionStatus] = useState("upcoming") // upcoming, ready, active, ended

  useEffect(() => {
    const updateSessionStatus = () => {
      const now = new Date()
      const sessionTime = new Date(session.dateTime)
      const timeDiff = sessionTime.getTime() - now.getTime()
      const minutesUntil = Math.floor(timeDiff / (1000 * 60))

      setTimeUntilSession(minutesUntil)

      // Allow joining 15 minutes before session starts
      if (minutesUntil <= 15 && minutesUntil >= -30) {
        setCanJoin(true)
        if (minutesUntil <= 0 && minutesUntil >= -30) {
          setSessionStatus("active")
        } else {
          setSessionStatus("ready")
        }
      } else if (minutesUntil < -30) {
        setSessionStatus("ended")
        setCanJoin(false)
      } else {
        setSessionStatus("upcoming")
        setCanJoin(false)
      }
    }

    updateSessionStatus()
    const interval = setInterval(updateSessionStatus, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [session.dateTime])

  const handleJoinCall = async () => {
    try {
      // In a real app, this would initiate the video call
      toast.success("Joining session...")

      if (onJoinCall) {
        onJoinCall(session)
      }

      // Simulate joining call - replace with actual video call integration
      window.open(`/video-call/${session.id}`, "_blank")
    } catch (error) {
      toast.error("Failed to join session")
    }
  }

  const getButtonText = () => {
    switch (sessionStatus) {
      case "ready":
        return "Join Call"
      case "active":
        return "Join Active Session"
      case "ended":
        return "Session Ended"
      default:
        return `Starts in ${Math.abs(timeUntilSession)}min`
    }
  }

  const getButtonIcon = () => {
    switch (sessionStatus) {
      case "ready":
      case "active":
        return <Video className="h-4 w-4" />
      case "ended":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getButtonVariant = () => {
    switch (sessionStatus) {
      case "ready":
        return "default"
      case "active":
        return "default"
      case "ended":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Button
      onClick={handleJoinCall}
      disabled={!canJoin}
      variant={getButtonVariant()}
      size="sm"
      className={`${
        sessionStatus === "active" ? "bg-green-500 hover:bg-green-600 animate-pulse" : ""
      } ${sessionStatus === "ready" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
    >
      {getButtonIcon()}
      <span className="ml-2">{getButtonText()}</span>
    </Button>
  )
}
