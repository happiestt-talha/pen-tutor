"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function UpcomingTuitionsList() {
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && token) {
      const fetchSessions = async () => {
        try {
          // This endpoint should be created in your backend
          const response = await fetch(`/api/tutor/${user.id}/upcoming-sessions`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (!response.ok) {
            throw new Error('Failed to fetch upcoming tuitions')
          }
          const data = await response.json()
          setSessions(data)
        } catch (err) {
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }
      fetchSessions()
    }
  }, [user, token])

  const handleStartMeeting = (meetingId) => {
    router.push(`/meetings/room/${meetingId}`)
  }

  if (isLoading) return <div>Loading upcoming tuitions...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tuitions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <ul className="space-y-4">
            {sessions.map(session => (
              <li key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{session.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(session.start_time).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">With: {session.student_name}</p>
                </div>
                <Button onClick={() => handleStartMeeting(session.meeting_id)}>Start Class</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming tuitions.</p>
        )}
      </CardContent>
    </Card>
  )
}
