"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import CreateMeetingModal from "@/components/meetings/CreateMeetingModal"
import JoinMeetingButton from "@/components/meetings/JoinMeetingButton"
import { Video, Calendar, Users, Clock, Search, Plus, Download } from "lucide-react"
import { toast } from "sonner"

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [joinMeetingId, setJoinMeetingId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const host = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      if (!token) {
        router.push("/auth")
        return
      }

      const response = await fetch(`${host}api/meetings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMeetings(data.results || [])
      } else {
        toast.error("Failed to fetch meetings")
      }
    } catch (error) {
      console.error("Failed to fetch meetings:", error)
      toast.error("Failed to fetch meetings")
    } finally {
      setLoading(false)
    }
  }

  const handleMeetingCreated = (meetingData) => {
    // Add new meeting to the list
    setMeetings((prev) => [meetingData.meeting, ...prev])
    // Redirect to the meeting room
    router.push(`/meetings/room/${meetingData.meeting_id}`)
  }

  const handleJoinMeeting = (meeting) => {
    router.push(`/meetings/room/${meeting.meeting_id}`)
  }

  const handleJoinById = () => {
    if (!joinMeetingId.trim()) {
      toast.error("Please enter a meeting ID")
      return
    }
    router.push(`/meetings/room/${joinMeetingId}`)
  }

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.meeting_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const upcomingMeetings = filteredMeetings.filter(
    (meeting) => meeting.status === "scheduled" || meeting.status === "active",
  )

  const pastMeetings = filteredMeetings.filter((meeting) => meeting.status === "ended")

  const quickActions = [
    {
      title: "Start Instant Meeting",
      description: "Begin a meeting right now",
      icon: Video,
      color: "bg-blue-600",
      action: "instant",
    },
    {
      title: "Schedule Meeting",
      description: "Plan a meeting for later",
      icon: Calendar,
      color: "bg-green-600",
      action: "scheduled",
    },
    {
      title: "Join Meeting",
      description: "Enter a meeting ID to join",
      icon: Users,
      color: "bg-purple-600",
      action: "join",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Video Meetings</h1>
          <p className="text-lg text-gray-600">Manage your meetings and connect with students and tutors</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.action} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div
                    className={`${action.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  {action.action === "instant" && (
                    <CreateMeetingModal
                      trigger={
                        <Button className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Start Now
                        </Button>
                      }
                      onMeetingCreated={handleMeetingCreated}
                    />
                  )}
                  {action.action === "scheduled" && (
                    <CreateMeetingModal
                      trigger={
                        <Button variant="outline" className="w-full bg-transparent">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      }
                      onMeetingCreated={handleMeetingCreated}
                    />
                  )}
                  {action.action === "join" && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter Meeting ID"
                        value={joinMeetingId}
                        onChange={(e) => setJoinMeetingId(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleJoinById()}
                      />
                      <Button variant="outline" className="w-full bg-transparent" onClick={handleJoinById}>
                        <Users className="h-4 w-4 mr-2" />
                        Join Meeting
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Meetings</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : upcomingMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg truncate">{meeting.title}</h3>
                      <Badge
                        variant={meeting.status === "active" ? "default" : "secondary"}
                        className={meeting.status === "active" ? "bg-green-600" : ""}
                      >
                        {meeting.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {meeting.scheduled_time ? new Date(meeting.scheduled_time).toLocaleString() : "Instant Meeting"}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {meeting.participants_count || 0} participants
                      </div>
                      <div className="text-xs text-gray-500">ID: {meeting.meeting_id}</div>
                    </div>

                    <div className="flex space-x-2">
                      <JoinMeetingButton meeting={meeting} onJoinMeeting={handleJoinMeeting} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(meeting.meeting_id)}
                      >
                        Copy ID
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">No upcoming meetings</p>
                <p className="text-sm text-gray-400">Create a new meeting to get started</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Meetings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Meetings</h2>
          {pastMeetings.length > 0 ? (
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{meeting.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {meeting.ended_at ? new Date(meeting.ended_at).toLocaleString() : "Recently ended"}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {meeting.participants_count || 0} participants
                          </div>
                          <div>Duration: {meeting.duration_minutes || 0} minutes</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Ended</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/meetings/recordings/${meeting.meeting_id}`)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Recording
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">No past meetings</p>
                <p className="text-sm text-gray-400">Your meeting history will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
