"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Clock, Book, User, Calendar } from 'lucide-react'
import Loader from '@/components/shared/Loader'

function StartMeetingButton({ tuitionId }) {
  const [isStarting, setIsStarting] = useState(false)
  const router = useRouter()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const handleStartMeeting = async () => {
    setIsStarting(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.post(`${API_BASE}/api/meetings/start/${tuitionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const { meetingId } = response.data
      toast.success('Meeting started! Redirecting...')
      router.push(`/meetings/room/${meetingId}`)
    } catch (error) {
      console.error("Failed to start meeting:", error)
      toast.error('Failed to start meeting. Please try again.')
      setIsStarting(false)
    }
  }

  return (
    <Button className="w-full" onClick={handleStartMeeting} disabled={isStarting}>
      {isStarting ? 'Starting...' : 'Start Meeting'}
    </Button>
  )
}

export default function AcceptedTuitionsPage() {
  const [tuitions, setTuitions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchAcceptedTuitions()
    }
  }, [isAuthenticated])

  const fetchAcceptedTuitions = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      // NOTE: Assuming an endpoint exists to get tuitions accepted by the tutor.
      // The prompt did not specify this endpoint, so I'm using a placeholder.
      // You might need to adjust this to `/api/jobs/tutor/tuitions` or similar.
      const response = await axios.get(`${API_BASE}/api/jobs/tutor/tuitions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTuitions(response.data)
    } catch (error) {
      console.error("Failed to fetch accepted tuitions:", error)
      toast.error('Failed to load your accepted tuitions.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loader text="Loading Your Tuitions..." isFullScreen={true} />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Accepted Tuitions</h1>
      {tuitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tuitions.map((tuition) => (
            <Card key={tuition.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{tuition.title}</CardTitle>
                <CardDescription>With {tuition.student.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Book className="h-4 w-4" />
                  <div className="flex flex-wrap gap-1">
                    {tuition.subjects.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="capitalize">{tuition.schedule.days.join(', ')} at {tuition.schedule.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{tuition.schedule.duration} minutes</span>
                </div>
              </CardContent>
              <CardFooter>
                <StartMeetingButton tuitionId={tuition.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No Accepted Tuitions</h3>
          <p className="text-muted-foreground mt-2">Accept a tuition from the Job Board to get started.</p>
        </div>
      )}
    </div>
  )
}
