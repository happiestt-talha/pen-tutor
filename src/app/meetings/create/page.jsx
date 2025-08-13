"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CreateMeetingModal from "@/components/meetings/CreateMeetingModal"
import { Video, Calendar, Users, Clock } from "lucide-react"

export default function CreateMeetingPage() {
  const router = useRouter()

  const handleMeetingCreated = (meetingData) => {
    // Redirect to the meeting room
    router.push(`/meetings/join/${meetingData.meeting_id}`)
  }

  const quickMeetingOptions = [
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Video Meetings</h1>
          <p className="text-lg text-gray-600">Connect with students and tutors through high-quality video calls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickMeetingOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card key={option.action} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div
                    className={`${option.color} text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{option.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  {option.action === "instant" && (
                    <CreateMeetingModal
                      trigger={<Button className="w-full">Start Now</Button>}
                      onMeetingCreated={handleMeetingCreated}
                    />
                  )}
                  {option.action === "scheduled" && (
                    <CreateMeetingModal
                      trigger={
                        <Button variant="outline" className="w-full bg-transparent">
                          Schedule
                        </Button>
                      }
                      onMeetingCreated={handleMeetingCreated}
                    />
                  )}
                  {option.action === "join" && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/meetings/join")}
                    >
                      Join Meeting
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Meetings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent meetings found</p>
              <p className="text-sm">Your meeting history will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
