"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, Clock, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Mock sessions data - replace with actual API call
const mockSessions = [
  {
    id: "SES001",
    meetingId: "MTG-TUTOR-001",
    password: "tutor123",
    studentId: "PTS100",
    studentName: "Muhammad Ahmad",
    classLevel: "O Level 1",
    subject: "Chemistry",
    scheduledTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    timings: "Monday 10:00 AM - 11:00 AM",
    mode: "Online",
    status: "Active",
  },
  {
    id: "SES002",
    meetingId: "MTG-TUTOR-002",
    password: null,
    studentId: "PTS200",
    studentName: "Sarah Khan",
    classLevel: "A Level 2",
    subject: "Physics",
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    timings: "Tuesday 2:00 PM - 3:00 PM",
    mode: "Home",
    status: "Scheduled",
  },
]

function JoinSessionButton({ session }) {
  const [isJoining, setIsJoining] = useState(false)
  const [timeUntilSession, setTimeUntilSession] = useState(null)
  const [canJoin, setCanJoin] = useState(false)
  const [sessionStatus, setSessionStatus] = useState("upcoming")
  const router = useRouter()

  useEffect(() => {
    const updateSessionStatus = () => {
      const now = new Date()
      const sessionTime = new Date(session.scheduledTime)
      const timeDiff = sessionTime.getTime() - now.getTime()
      const minutesUntil = Math.floor(timeDiff / (1000 * 60))

      setTimeUntilSession(minutesUntil)

      // Allow joining 15 minutes before and 30 minutes after scheduled time
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
    const interval = setInterval(updateSessionStatus, 60000)

    return () => clearInterval(interval)
  }, [session.scheduledTime])

  const handleJoinSession = async () => {
    if (!canJoin) {
      toast.error("Session is not available to join at this time")
      return
    }

    setIsJoining(true)

    try {
      // Build the auto-join URL with optional password
      const joinUrl = `/meetings/join/${session.meetingId}${
        session.password ? `?password=${encodeURIComponent(session.password)}` : ""
      }`

      // Navigate to the auto-join page
      router.push(joinUrl)
    } catch (error) {
      console.error("Failed to join session:", error)
      toast.error("Failed to join session. Please try again.")
      setIsJoining(false)
    }
  }

  const handleMouseEnter = () => {
    if (canJoin && !isJoining) {
      router.prefetch(`/meetings/join/${session.meetingId}`)
    }
  }

  const getButtonText = () => {
    if (isJoining) return "Joining..."

    switch (sessionStatus) {
      case "ready":
        return "Start Session"
      case "active":
        return "Join Active Session"
      case "ended":
        return "Session Ended"
      default:
        return `Starts in ${Math.abs(timeUntilSession)}min`
    }
  }

  const getButtonIcon = () => {
    if (isJoining) return <Loader2 className="h-4 w-4 animate-spin" />

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

  const getButtonClassName = () => {
    switch (sessionStatus) {
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
      onClick={handleJoinSession}
      onMouseEnter={handleMouseEnter}
      disabled={!canJoin || isJoining}
      variant={getButtonVariant()}
      size="sm"
      className={getButtonClassName()}
    >
      {getButtonIcon()}
      <span className="ml-2">{getButtonText()}</span>
    </Button>
  )
}

export default function UpcomingSessions() {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    // Replace with actual API call
    setSessions(mockSessions)
  }, [])

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-400">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-2">Student ID</th>
                <th className="text-left py-2 px-2">Class/Level</th>
                <th className="text-left py-2 px-2">Subject</th>
                <th className="text-left py-2 px-2">Date/Day</th>
                <th className="text-left py-2 px-2">Timings</th>
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={session.id} className="border-b border-blue-400/30">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium">{session.studentId}</div>
                      <div className="text-xs opacity-80">({session.studentName})</div>
                    </div>
                  </td>
                  <td className="py-3 px-2">{session.classLevel}</td>
                  <td className="py-3 px-2">{session.subject}</td>
                  <td className="py-3 px-2">{session.scheduledTime.toLocaleDateString()}</td>
                  <td className="py-3 px-2">{session.timings}</td>
                  <td className="py-3 px-2">
                    <Badge variant={session.mode === "Online" ? "default" : "secondary"}>{session.mode}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={session.status === "Active" ? "default" : "outline"}>{session.status}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <JoinSessionButton session={session} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
