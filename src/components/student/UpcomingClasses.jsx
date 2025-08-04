"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import JoinCallButton from "@/components/shared/JoinCallButton"

export default function UpcomingClasses() {
  const [classes, setClasses] = useState([])

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockClasses = [
      {
        id: "CLS001",
        tutorId: "TUT001",
        tutorName: "Dr. Sarah Johnson",
        subject: "Chemistry",
        classLevel: "O Level",
        dateTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        timings: "Monday 10:00 AM - 11:00 AM",
        mode: "Online",
        status: "Active",
      },
      {
        id: "CLS002",
        tutorId: "TUT002",
        tutorName: "Prof. Michael Chen",
        subject: "Physics",
        classLevel: "A Level",
        dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        timings: "Tuesday 2:00 PM - 3:00 PM",
        mode: "Home",
        status: "Scheduled",
      },
    ]
    setClasses(mockClasses)
  }, [])

  const handleJoinCall = (classItem) => {
    console.log("Joining call for class:", classItem)
    // Implement video call logic here
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Upcoming Classes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-yellow-400">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-2">Tutor</th>
                <th className="text-left py-2 px-2">Subject</th>
                <th className="text-left py-2 px-2">Level</th>
                <th className="text-left py-2 px-2">Date/Day</th>
                <th className="text-left py-2 px-2">Timings</th>
                <th className="text-left py-2 px-2">Mode</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem, index) => (
                <tr key={classItem.id} className="border-b border-yellow-400/30">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium">{classItem.tutorName}</div>
                      <div className="text-xs opacity-80">ID: {classItem.tutorId}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2">{classItem.subject}</td>
                  <td className="py-3 px-2">{classItem.classLevel}</td>
                  <td className="py-3 px-2">{classItem.dateTime.toLocaleDateString()}</td>
                  <td className="py-3 px-2">{classItem.timings}</td>
                  <td className="py-3 px-2">
                    <Badge variant={classItem.mode === "Online" ? "default" : "secondary"}>{classItem.mode}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={classItem.status === "Active" ? "default" : "outline"}>{classItem.status}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <JoinCallButton session={classItem} onJoinCall={handleJoinCall} />
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
