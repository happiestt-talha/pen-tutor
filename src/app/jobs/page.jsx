"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Clock, Book, User, MapPin, Calendar } from 'lucide-react'
import Loader from '@/components/shared/Loader'

function TuitionCard({ tuition, onAccept }) {
  const getBadgeVariant = (method) => {
    switch (method) {
      case 'online':
        return 'default'
      case 'in-person':
        return 'destructive'
      case 'hybrid':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{tuition.title}</CardTitle>
          <Badge variant={getBadgeVariant(tuition.preferredMethod)} className="capitalize">{tuition.preferredMethod}</Badge>
        </div>
        <CardDescription>Posted by {tuition.createdBy.name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <p className="text-sm text-muted-foreground">{tuition.description}</p>
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
        <Button className="w-full" onClick={() => onAccept(tuition.id)}>Accept Tuition</Button>
      </CardFooter>
    </Card>
  )
}

export default function JobBoardPage() {
  const [tuitions, setTuitions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user?.user_type === 'tutor') {
      fetchTuitions()

      const ws = new WebSocket(`${API_BASE}/ws/tuitions/`)
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'tuition_accepted') {
          toast.info(`Tuition "${data.title}" has been accepted by another tutor.`)
          setTuitions(prev => prev.filter(t => t.id !== data.tuition_id))
        }
      }

      return () => ws.close()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const fetchTuitions = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get(`${API_BASE}/api/jobs/tuitions/active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTuitions(response.data)
    } catch (error) {
      console.error("Failed to fetch tuitions:", error)
      toast.error('Failed to load available tuitions.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async (tuitionId) => {
    try {
      const token = localStorage.getItem('access_token')
      await axios.post(`${API_BASE}/api/jobs/tuitions/${tuitionId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Tuition accepted successfully!')
      setTuitions(prev => prev.filter(t => t.id !== tuitionId))
    } catch (error) {
      console.error("Failed to accept tuition:", error)
      toast.error('Failed to accept tuition. It might have been taken.')
    }
  }

  if (isLoading) {
    return <Loader text="Loading Job Board..." isFullScreen={true} />
  }

  if (!isAuthenticated) {
     return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Job Board</h2>
        <p className="text-muted-foreground mb-6">Please log in or register to view and apply for tuitions.</p>
        <Button onClick={() => router.push('/auth')}>Login / Register</Button>
      </div>
     )
  }

  if (user?.user_type === 'student') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Post a Tuition Request</h2>
        <p className="text-muted-foreground mb-6">Let tutors know you need help by creating a new tuition request.</p>
        <Button onClick={() => router.push('/student/create-class')}>Create Tuition Request</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Tuitions</h1>
        <p className="text-muted-foreground">{tuitions.length} tuitions available</p>
      </div>
      {tuitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tuitions.map((tuition) => (
            <TuitionCard key={tuition.id} tuition={tuition} onAccept={handleAccept} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">No Tuitions Available</h3>
          <p className="text-muted-foreground mt-2">Check back later for new tuition opportunities.</p>
        </div>
      )}
    </div>
  )
}
