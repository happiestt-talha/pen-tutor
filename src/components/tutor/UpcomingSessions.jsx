"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import JoinCallButton from "@/components/shared/JoinCallButton"

export default function UpcomingSessions() {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockSessions = [
      {
        id: "SES001",
        studentId: "PTS100",
        studentName: "Muhammad Ahmad",
        classLevel: "O Level 1",
        subject: "Chemistry",
        dateTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        timings: "Monday 10:00 AM - 11:00 AM",
        mode: "Online",
        status: "Active",
      },
      {
        id: "SES002",
        studentId: "PTS200",
        studentName: "Sarah Khan",
        classLevel: "A Level 2",
        subject: "Physics",
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        timings: "Tuesday 2:00 PM - 3:00 PM",
        mode: "Home",
        status: "Scheduled",
      },
    ]
    setSessions(mockSessions)
  }, [])

  const handleJoinCall = (session) => {
    console.log("Joining call for session:", session)
    // Implement video call logic here
  }

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Upcoming Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-400">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-2">Student ID</th>
                <th className="text-left py-2 px-2">Class/Level</th>
                <th className="text-left py-2 px-2">Subject</th>
                <th className="text-left py-2 px-2">Date/Day</th>
                <th className="text-left py-2 px-2">Timings</th>
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={session.id} className="border-b border-blue-400/30">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium">{session.studentId}</div>
                      <div className="text-xs opacity-80">({session.studentName})</div>
                    </div>
                  </td>
                  <td className="py-3 px-2">{session.classLevel}</td>
                  <td className="py-3 px-2">{session.subject}</td>
                  <td className="py-3 px-2">{session.dateTime.toLocaleDateString()}</td>
                  <td className="py-3 px-2">{session.timings}</td>
                  <td className="py-3 px-2">
                    <Badge variant={session.mode === "Online" ? "default" : "secondary"}>{session.mode}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={session.status === "Active" ? "default" : "outline"}>{session.status}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <JoinCallButton session={session} onJoinCall={handleJoinCall} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
