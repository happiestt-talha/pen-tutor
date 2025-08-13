"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User, Calendar, AlertCircle } from 'lucide-react'
import { toast } from "sonner"
import Loader from "@/components/shared/Loader"

export default function PendingClasses({ onClassAccepted }) {
  const [pendingClasses, setPendingClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [acceptingId, setAcceptingId] = useState(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const fetchPendingClasses = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_BASE}/api/classes/pending/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setPendingClasses(data.results || [])
      } else {
        toast.error("Failed to load pending classes.")
      }
    } catch (error) {
      toast.error("An error occurred while fetching pending classes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingClasses()
  }, [])

  const handleAcceptClass = async (classId) => {
    setAcceptingId(classId)
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_BASE}/api/classes/${classId}/accept/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        toast.success("Class accepted successfully!")
        onClassAccepted() // Callback to refresh parent component
        fetchPendingClasses() // Refresh this component's list
      } else {
        toast.error("Failed to accept class.")
      }
    } catch (error) {
      toast.error("An error occurred while accepting the class.")
    } finally {
      setAcceptingId(null)
    }
  }

  if (loading) {
    return <Loader text="Loading Pending Classes..." />
  }

  if (pendingClasses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Class Requests</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-500 py-8">
          <AlertCircle className="mx-auto h-8 w-8 mb-2" />
          No pending class requests.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Class Requests ({pendingClasses.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingClasses.map((classItem) => (
          <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={classItem.student?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{classItem.student?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{classItem.title}</h3>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <span className="flex items-center gap-1"><User className="h-4 w-4" />{classItem.student?.name}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{new Date(classItem.scheduled_time).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{new Date(classItem.scheduled_time).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <Button onClick={() => handleAcceptClass(classItem.id)} disabled={acceptingId === classItem.id}>
              {acceptingId === classItem.id ? <Loader size="sm" /> : "Accept"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
