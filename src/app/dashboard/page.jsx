"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Users, TrendingUp, Video, Bell, Loader2, Play, CheckCircle } from "lucide-react"
import { toast } from "sonner"

/**
 * DashboardPage Component
 *
 * Responsibility:
 * - Main dashboard interface for students
 * - Displays upcoming classes with join functionality
 * - Shows learning progress and statistics
 * - Manages class status and join button states
 * - Handles navigation to auto-join meeting page
 *
 * Workflow:
 * 1. Loads user data and upcoming classes from API/localStorage
 * 2. Calculates real-time class status (upcoming, ready, active, ended)
 * 3. Renders join buttons with appropriate states and actions
 * 4. On join click: navigates to /meetings/join/{meetingId}?password={password}
 * 5. Pre-fetches join routes on hover for instant navigation
 * 6. Updates UI with loading states during join process
 */
export default function DashboardPage() {
  // Component state management
  const [user, setUser] = useState(null)
  const [upcomingClasses, setUpcomingClasses] = useState([])
  const [joiningMeetings, setJoiningMeetings] = useState(new Set()) // Track which meetings are being joined
  const router = useRouter()

  /**
   * Load dashboard data on component mount
   * Fetches user profile and upcoming classes
   */
  useEffect(() => {
    loadDashboardData()
  }, [])

  /**
   * Loads user data and upcoming classes
   * In production, this would make API calls to Django backend
   */
  const loadDashboardData = async () => {
    try {
      // Check authentication
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/auth")
        return
      }

      // Mock user data - replace with actual API call
      setUser({
        name: "John Doe",
        email: "john@example.com",
        role: "student",
        avatar: "/placeholder.svg?height=40&width=40",
      })

      // Mock upcoming classes with meeting IDs - replace with actual API call
      setUpcomingClasses([
        {
          id: "CLS001",
          meetingId: "f8c4b199-4530-4113-833f-d9c23ae01224", // Used for auto-join URL
          password: "class123", // Optional meeting password
          title: "Advanced Mathematics",
          tutor: "Dr. Sarah Wilson",
          tutorAvatar: "/placeholder.svg?height=32&width=32",
          scheduledTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
          duration: 60, // Duration in minutes
          subject: "Mathematics",
          status: "upcoming",
        },
        {
          id: "CLS002",
          meetingId: "a1b2c3d4-5678-9012-3456-789012345678",
          password: "physics101",
          title: "Physics Lab Session",
          tutor: "Prof. Michael Chen",
          tutorAvatar: "/placeholder.svg?height=32&width=32",
          scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          duration: 90,
          subject: "Physics",
          status: "upcoming",
        },
        {
          id: "CLS003",
          meetingId: "xyz789-abc123-def456-ghi789",
          title: "English Literature Discussion",
          tutor: "Ms. Emily Johnson",
          tutorAvatar: "/placeholder.svg?height=32&width=32",
          scheduledTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago (active)
          duration: 75,
          subject: "English",
          status: "active",
        },
      ])
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
      toast.error("Failed to load dashboard data")
    }
  }

  /**
   * Determines the current status of a class based on scheduled time
   * Returns status object with join permissions and UI styling
   *
   * Status Logic:
   * - Active: Class is currently running (between start and end time)
   * - Ready: 15 minutes before start time (can join early)
   * - Upcoming: More than 15 minutes before start (cannot join yet)
   * - Ended: More than 30 minutes after start time (cannot join anymore)
   */
  const getClassStatus = (classItem) => {
    const now = new Date()
    const startTime = new Date(classItem.scheduledTime)
    const endTime = new Date(startTime.getTime() + classItem.duration * 60 * 1000)
    const timeDiff = startTime.getTime() - now.getTime()
    const minutesUntilStart = Math.floor(timeDiff / (1000 * 60))

    // Class is currently active (started and not ended)
    if (now >= startTime && now <= endTime) {
      return {
        status: "active",
        label: "Active Now",
        canJoin: true,
        variant: "default",
        bgColor: "bg-green-50 border-green-200",
        textColor: "text-green-700",
      }
    }

    // Class can be joined early (15 minutes before start)
    if (minutesUntilStart <= 15 && minutesUntilStart > -30) {
      return {
        status: "ready",
        label: "Ready to Join",
        canJoin: true,
        variant: "default",
        bgColor: "bg-blue-50 border-blue-200",
        textColor: "text-blue-700",
      }
    }

    // Class has ended (more than 30 minutes after start)
    if (now > endTime) {
      return {
        status: "ended",
        label: "Class Ended",
        canJoin: false,
        variant: "secondary",
        bgColor: "bg-gray-50 border-gray-200",
        textColor: "text-gray-500",
      }
    }

    // Class is upcoming (more than 15 minutes away)
    return {
      status: "upcoming",
      label: `Starts in ${minutesUntilStart}min`,
      canJoin: false,
      variant: "outline",
      bgColor: "bg-white border-gray-200",
      textColor: "text-gray-600",
    }
  }

  /**
   * Handles joining a class meeting
   * Navigates to the auto-join page which handles the actual API call
   *
   * Flow:
   * 1. Validates class can be joined
   * 2. Sets loading state for the specific class
   * 3. Pre-fetches the auto-join route for faster navigation
   * 4. Constructs join URL with meetingId and optional password
   * 5. Navigates to auto-join page
   * 6. Auto-join page handles API call and redirects to meeting room
   */
  const handleJoinClass = async (classItem) => {
    const classStatus = getClassStatus(classItem)

    // Validate join permissions
    if (!classStatus.canJoin) {
      toast.error("Class is not available to join yet")
      return
    }

    // Add to joining state to show loading spinner
    setJoiningMeetings((prev) => new Set([...prev, classItem.id]))

    try {
      // Pre-fetch the auto-join route for faster navigation
      router.prefetch(`/meetings/join/${classItem.meetingId}`)

      // Build the join URL with optional password parameter
      let joinUrl = `/meetings/join/${classItem.meetingId}`
      if (classItem.password) {
        joinUrl += `?password=${encodeURIComponent(classItem.password)}`
      }

      // Navigate to auto-join page (which handles the actual API call)
      router.push(joinUrl)

      toast.success("Joining class...")
    } catch (error) {
      console.error("Failed to join class:", error)
      toast.error("Failed to join class")

      // Remove from joining state on error
      setJoiningMeetings((prev) => {
        const newSet = new Set(prev)
        newSet.delete(classItem.id)
        return newSet
      })
    }
  }

  /**
   * Pre-fetches the auto-join route when user hovers over join button
   * Provides instant navigation when clicked
   */
  const handleMouseEnter = (classItem) => {
    const classStatus = getClassStatus(classItem)
    if (classStatus.canJoin && !joiningMeetings.has(classItem.id)) {
      router.prefetch(`/meetings/join/${classItem.meetingId}`)
    }
  }

  /**
   * Formats time for display (e.g., "2:30 PM")
   */
  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  /**
   * Formats date for display (e.g., "Today", "Tomorrow", "Jan 15")
   */
  const formatDate = (date) => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    }
  }

  // Show loading state while user data is being loaded
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Here's what's happening with your classes today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today's Classes</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Hours This Week</p>
                  <p className="text-2xl font-bold text-gray-900">12.5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Tutors</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Classes Section - Main Feature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="h-5 w-5 mr-2" />
              Upcoming Classes
            </CardTitle>
            <CardDescription>Your scheduled classes for today and tomorrow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => {
                const classStatus = getClassStatus(classItem)
                const isJoining = joiningMeetings.has(classItem.id)

                return (
                  <div
                    key={classItem.id}
                    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${classStatus.bgColor}`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Class Information */}
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={classItem.tutorAvatar || "/placeholder.svg"} alt={classItem.tutor} />
                          <AvatarFallback>
                            {classItem.tutor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{classItem.title}</h3>
                            <Badge variant={classStatus.variant} className="text-xs">
                              {classStatus.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">with {classItem.tutor}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(classItem.scheduledTime)}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTime(classItem.scheduledTime)} ({classItem.duration}min)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Join Button and Status */}
                      <div className="flex items-center space-x-3">
                        {/* Live indicator for active classes */}
                        {classStatus.status === "active" && (
                          <div className="flex items-center text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-sm font-medium">Live</span>
                          </div>
                        )}

                        {/* Dynamic Join Button */}
                        <Button
                          onClick={() => handleJoinClass(classItem)}
                          onMouseEnter={() => handleMouseEnter(classItem)}
                          disabled={!classStatus.canJoin || isJoining}
                          variant={classStatus.canJoin ? "default" : "secondary"}
                          size="sm"
                          className={`min-w-[120px] ${
                            classStatus.status === "active"
                              ? "bg-green-600 hover:bg-green-700 animate-pulse"
                              : classStatus.status === "ready"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : ""
                          }`}
                        >
                          {/* Dynamic button content based on state */}
                          {isJoining ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Joining...
                            </>
                          ) : classStatus.status === "active" ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Join Active Class
                            </>
                          ) : classStatus.status === "ready" ? (
                            <>
                              <Video className="h-4 w-4 mr-2" />
                              Join Class
                            </>
                          ) : classStatus.status === "ended" ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Class Ended
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 mr-2" />
                              {classStatus.label}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Additional Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Completed Math Assignment #5</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Attended Physics Lab Session</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Submitted English Essay</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Your progress across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mathematics</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Physics</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>English</span>
                    <span>91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
