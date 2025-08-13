"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users } from "lucide-react"
import { toast } from "sonner"

export default function JoinMeetingPage() {
  const [meetingId, setMeetingId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoinMeeting = async (e) => {
    e.preventDefault()

    if (!meetingId.trim()) {
      toast.error("Please enter a meeting ID")
      return
    }

    setLoading(true)

    try {
      // First, check if meeting exists and requires password
      const host = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const response = await fetch(`${host}api/meetings/${meetingId}/info/`)

      if (response.ok) {
        const meetingInfo = await response.json()

        // If meeting requires password and none provided
        if (meetingInfo.requires_password && !password.trim()) {
          toast.error("This meeting requires a password")
          setLoading(false)
          return
        }

        // Redirect to join meeting page
        router.push(`/meetings/join/${meetingId}${password ? `?password=${password}` : ""}`)
      } else {
        toast.error("Meeting not found or invalid meeting ID")
      }
    } catch (error) {
      console.error("Join meeting error:", error)
      toast.error("Failed to join meeting. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Join Meeting</CardTitle>
          <p className="text-gray-600">Enter the meeting ID to join a video call</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinMeeting} className="space-y-4">
            <div>
              <Label htmlFor="meetingId">Meeting ID *</Label>
              <Input
                id="meetingId"
                placeholder="Enter meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="text-center text-lg tracking-wider"
              />
            </div>

            <div>
              <Label htmlFor="password">Password (if required)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter meeting password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Video className="h-4 w-4 animate-pulse mr-2" />
                  Joining...
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Don't have a meeting ID?</p>
            <Button variant="outline" onClick={() => router.push("/meetings/create")} className="w-full">
              Create New Meeting
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
