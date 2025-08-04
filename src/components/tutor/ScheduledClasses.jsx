"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import JoinCallButton from "@/components/shared/JoinCallButton"

const scheduledClasses = {
  homeTuitions: [
    {
      id: "HT001",
      studentId: "PTS100",
      studentName: "Muhammad Ahmad",
      classLevel: "O Level 1",
      subject: "Chemistry",
      daysAndTiming: "Monday 7:00 PM-8:00 PM, Tuesday 7:00 PM-8:00 PM, Friday 7:00 PM-8:00 PM",
      location: "House No.15, Street No.5, DHA Phase 5, Lahore",
      dateTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    },
  ],
  onlineTuitions: [
    {
      id: "OT001",
      studentId: "PTS100",
      studentName: "Muhammad Ahmad",
      classLevel: "O Level 1",
      subject: "Chemistry",
      daysAndTime: "Monday 7:00 PM-8:00 PM, Tuesday 7:00 PM-8:00 PM, Friday 7:00 PM-8:00 PM",
      dateTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
    },
  ],
  groupSessions: [
    {
      id: "GS001",
      studentId: "PTS100",
      studentName: "Muhammad Ahmad",
      classLevel: "O Level 1",
      subject: "Chemistry",
      daysAndTime: "Monday 7:00 PM-8:00 PM, Tuesday 7:00 PM-8:00 PM, Friday 7:00 PM-8:00 PM",
      dateTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    },
  ],
}

function ClassTable({ title, classes, bgColor, textColor = "text-white" }) {
  const handleJoinCall = (session) => {
    console.log("Joining call for:", session)
  }

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <div className={`${bgColor} ${textColor} rounded-lg p-4`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/30">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-2">Student ID</th>
                <th className="text-left py-2 px-2">Class/Level</th>
                <th className="text-left py-2 px-2">Subject</th>
                <th className="text-left py-2 px-2">Days & Timing</th>
                {title.includes("Home") && <th className="text-left py-2 px-2">Location</th>}
                <th className="text-left py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem, index) => (
                <tr key={classItem.id} className="border-b border-white/20">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2">
                    <div>
                      <div className="font-medium">{classItem.studentId}</div>
                      <div className="text-xs opacity-80">({classItem.studentName})</div>
                    </div>
                  </td>
                  <td className="py-3 px-2">{classItem.classLevel}</td>
                  <td className="py-3 px-2">{classItem.subject}</td>
                  <td className="py-3 px-2">{classItem.daysAndTiming || classItem.daysAndTime}</td>
                  {title.includes("Home") && (
                    <td className="py-3 px-2 max-w-xs">
                      <div className="truncate">{classItem.location}</div>
                    </td>
                  )}
                  <td className="py-3 px-2">
                    <JoinCallButton session={classItem} onJoinCall={handleJoinCall} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function ScheduledClasses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">My Scheduled Classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ClassTable
          title="My Scheduled Home Tuitions"
          classes={scheduledClasses.homeTuitions}
          bgColor="bg-yellow-500"
        />
        <ClassTable
          title="My Scheduled Online Tuitions"
          classes={scheduledClasses.onlineTuitions}
          bgColor="bg-cyan-500"
        />
        <ClassTable
          title="My Scheduled Online Group Sessions"
          classes={scheduledClasses.groupSessions}
          bgColor="bg-red-500"
        />
      </CardContent>
    </Card>
  )
}
