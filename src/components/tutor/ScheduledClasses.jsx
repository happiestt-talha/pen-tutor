"use client"

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Calendar, Clock, User } from 'lucide-react'
import { toast } from 'sonner'
import Loader from '@/components/shared/Loader'
import StartMeetingButton from './StartMeetingButton'

/**
 * ScheduledClasses Component
 * 
 * Responsibilities:
 * - Display tutor's scheduled classes for today and upcoming days
 * - Allow tutors to start classes at the scheduled time (with 5-minute early window)
 * - Create meeting rooms when classes are started
 * - Handle class status updates and real-time state management
 * - Provide visual feedback for different class states (upcoming, ready to start, active, completed)
 */
export default function ScheduledClasses() {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem("access_token");
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const fetchAcceptedTuitions = useCallback(async () => {
    console.log("Token:", token)
    if (!token) return
    setIsLoading(true)
    try {
      // Assuming this endpoint exists for tutors to get their accepted tuitions
      const response = await axios.get(`${API_BASE}/api/teacher/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCourses(response.data?.data || [])
      console.log("Courses:", response.data)
    } catch (error) {
      toast.error("Failed to fetch scheduled classes.")
      console.error("Error fetching scheduled classes:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAcceptedTuitions()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Scheduled Classes</CardTitle>
          <CardDescription>Loading your upcoming classes...</CardDescription>
        </CardHeader>
        <CardContent>
          <Loader text="Fetching classes..." />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Scheduled Classes</CardTitle>
        <CardDescription>Here are your upcoming and active classes.</CardDescription>
      </CardHeader>
      <CardContent>
        {courses?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 py-8">
            <AlertCircle className="h-10 w-10 mb-4" />
            <p>You have no scheduled classes at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses?.map((course) => (
              <div key={course.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{course.name}</h3>
                    <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {course.student.name}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {course.schedule.days.join(', ')}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.schedule.time} ({course.schedule.duration} mins)</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {course.status === 'active' && <StartMeetingButton course={course} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
