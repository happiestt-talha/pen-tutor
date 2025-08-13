"use client"

import { useParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { useEffect, useState } from 'react'
import MeetingRoom from '@/components/meetings/MeetingRoom'
import Loader from '@/components/shared/Loader'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function MeetingRoomPage() {
  const params = useParams()
  const { meetingId } = params
  const { isAuthenticated } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !isAuthenticated) {
    return <Loader text="Connecting to meeting..." isFullScreen={true} />
  }

  return (
    <div className="w-screen h-screen bg-gray-900">
      <MeetingRoom meetingId={meetingId} />
    </div>
  )
}

export default function ProtectedMeetingRoomPage() {
    return (
        <ProtectedRoute allowedRoles={['student', 'tutor']}>
            <MeetingRoomPage />
        </ProtectedRoute>
    )
}
