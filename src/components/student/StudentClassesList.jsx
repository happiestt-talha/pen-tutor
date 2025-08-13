"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from 'axios'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Calendar, Clock, User, Video } from 'lucide-react'
import { toast } from 'sonner'
import Loader from '@/components/shared/Loader'

export default function StudentClassesList() {
  const [tuitions, setTuitions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuth()
  const router = useRouter()
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const fetchStudentTuitions = useCallback(async () => {
    if (!token) return
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_BASE}/api/jobs/student/tuitions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTuitions(response.data || [])
    } catch (error) {
      toast.error("Failed to fetch your tuitions.")
      console.error("Error fetching student tuitions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [token, API_BASE])

  useEffect(() => {
    fetchStudentTuitions()
  }, [fetchStudentTuitions])

  const handleJoinMeeting = (meetingId) => {
    toast.info("Redirecting to meeting room...")
    router.push(`/meetings/room/${meetingId}`)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Tuitions</CardTitle>
          <CardDescription>Loading your scheduled tuitions...</CardDescription>
        </CardHeader>
        <CardContent>
          <Loader text="Fetching your tuitions..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tuitions</CardTitle>
        <CardDescription>Here are all your requested tuitions and their status.</CardDescription>
      </CardHeader>
      <CardContent>
        {tuitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 py-8">
            <AlertCircle className="h-10 w-10 mb-4" />
            <p>You haven't created any tuition requests yet.</p>
            <Button className="mt-4" onClick={() => router.push('/student/create-class')}>Request a Tuition</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tuitions.map((tuition) => (
              <div key={tuition.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{tuition.title}</h3>
                    {getStatusBadge(tuition.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tuition.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {tuition.tutor?.name || 'Awaiting Tutor'}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {tuition.schedule.days.join(', ')}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {tuition.schedule.time} ({tuition.schedule.duration} mins)</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {tuition.status === 'active' && tuition.meetingId && (
                    <Button onClick={() => handleJoinMeeting(tuition.meetingId)}>
                      <Video className="mr-2 h-4 w-4" />
                      Join Meeting
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
