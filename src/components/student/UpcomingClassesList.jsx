"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function UpcomingClassesList() {
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && token) {
      const fetchClasses = async () => {
        try {
          // This endpoint should be created in your backend
          const response = await fetch(`/api/student/${user.id}/upcoming-classes`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          if (!response.ok) {
            throw new Error('Failed to fetch upcoming classes')
          }
          const data = await response.json()
          setClasses(data)
        } catch (err) {
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }
      fetchClasses()
    }
  }, [user, token])

  const handleJoinMeeting = (meetingId) => {
    router.push(`/meetings/room/${meetingId}`)
  }

  if (isLoading) return <div>Loading upcoming classes...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
      </CardHeader>
      <CardContent>
        {classes.length > 0 ? (
          <ul className="space-y-4">
            {classes.map(session => (
              <li key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{session.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(session.start_time).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Tutor: {session.tutor_name}</p>
                </div>
                <Button onClick={() => handleJoinMeeting(session.meeting_id)}>Join Class</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming classes.</p>
        )}
      </CardContent>
    </Card>
  )
}
