"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, Play, Search, Calendar, Clock, Users } from "lucide-react"
import { toast } from "sonner"

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchRecordings()
  }, [])

  const fetchRecordings = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const host = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      const response = await fetch(`${host}api/meetings/recordings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecordings(data.results || [])
      } else {
        toast.error("Failed to fetch recordings")
      }
    } catch (error) {
      console.error("Failed to fetch recordings:", error)
      toast.error("Failed to fetch recordings")
    } finally {
      setLoading(false)
    }
  }

  const downloadRecording = async (meetingId, title) => {
    try {
      const token = localStorage.getItem("access_token")
      const host = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

      const response = await fetch(`${host}api/meetings/download-recording/${meetingId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${title}-recording.mp4`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Recording download started")
      } else {
        toast.error("Recording not available")
      }
    } catch (error) {
      console.error("Failed to download recording:", error)
      toast.error("Failed to download recording")
    }
  }

  const filteredRecordings = recordings.filter(
    (recording) =>
      recording.meeting_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.meeting_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Meeting Recordings</h1>
          <p className="text-lg text-gray-600">Access and download your meeting recordings</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Recordings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredRecordings.length > 0 ? (
          <div className="space-y-4">
            {filteredRecordings.map((recording) => (
              <Card key={recording.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{recording.meeting_title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(recording.recorded_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {recording.duration} minutes
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {recording.participants_count} participants
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Meeting ID: {recording.meeting_id}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{(recording.file_size / (1024 * 1024)).toFixed(1)} MB</Badge>
                      <Button variant="outline" size="sm" onClick={() => window.open(recording.playback_url, "_blank")}>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadRecording(recording.meeting_id, recording.meeting_title)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Download className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recordings found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No recordings match your search" : "You don't have any meeting recordings yet"}
              </p>
              <p className="text-sm text-gray-400">Enable recording when creating meetings to save them for later</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
