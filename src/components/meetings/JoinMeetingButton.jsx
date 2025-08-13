"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Video, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function JoinMeetingButton({ meeting, onJoinMeeting }) {
  const [timeUntilMeeting, setTimeUntilMeeting] = useState(null)
  const [canJoin, setCanJoin] = useState(false)
  const [meetingStatus, setMeetingStatus] = useState("upcoming") // upcoming, ready, active, ended

  useEffect(() => {
    const updateMeetingStatus = () => {
      if (!meeting?.scheduled_time) {
        // Instant meeting - always available if active
        setCanJoin(meeting?.status === "active")
        setMeetingStatus(meeting?.status === "active" ? "active" : "ended")
        return
      }

      const now = new Date()
      const meetingTime = new Date(meeting.scheduled_time)
      const timeDiff = meetingTime.getTime() - now.getTime()
      const minutesUntil = Math.floor(timeDiff / (1000 * 60))

      setTimeUntilMeeting(minutesUntil)

      // Allow joining 15 minutes before scheduled time and up to 30 minutes after
      if (minutesUntil <= 15 && minutesUntil >= -30) {
        setCanJoin(true)
        if (minutesUntil <= 0 && minutesUntil >= -30) {
          setMeetingStatus("active")
        } else {
          setMeetingStatus("ready")
        }
      } else if (minutesUntil < -30) {
        setMeetingStatus("ended")
        setCanJoin(false)
      } else {
        setMeetingStatus("upcoming")
        setCanJoin(false)
      }
    }

    updateMeetingStatus()
    const interval = setInterval(updateMeetingStatus, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [meeting])

  const handleJoinMeeting = async () => {
    if (!canJoin) {
      toast.error("Meeting is not available to join at this time")
      return
    }

    try {
      if (onJoinMeeting) {
        onJoinMeeting(meeting)
      }
    } catch (error) {
      toast.error("Failed to join meeting")
    }
  }

  const getButtonText = () => {
    switch (meetingStatus) {
      case "ready":
        return "Join Meeting"
      case "active":
        return "Join Active Meeting"
      case "ended":
        return "Meeting Ended"
      default:
        if (timeUntilMeeting !== null) {
          const hours = Math.floor(Math.abs(timeUntilMeeting) / 60)
          const minutes = Math.abs(timeUntilMeeting) % 60

          if (hours > 0) {
            return `Starts in ${hours}h ${minutes}m`
          }
          return `Starts in ${Math.abs(timeUntilMeeting)}min`
        }
        return "Not Available"
    }
  }

  const getButtonIcon = () => {
    switch (meetingStatus) {
      case "ready":
      case "active":
        return <Video className="h-4 w-4" />
      case "ended":
        return <CheckCircle className="h-4 w-4" />
      default:
        return timeUntilMeeting !== null ? <Clock className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />
    }
  }

  const getButtonVariant = () => {
    switch (meetingStatus) {
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

  const getButtonClassName = () => {
    switch (meetingStatus) {
      case "active":
        return "bg-green-500 hover:bg-green-600 animate-pulse"
      case "ready":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return ""
    }
  }

  return (
    <Button
      onClick={handleJoinMeeting}
      disabled={!canJoin}
      variant={getButtonVariant()}
      size="sm"
      className={getButtonClassName()}
    >
      {getButtonIcon()}
      <span className="ml-2">{getButtonText()}</span>
    </Button>
  )
}
