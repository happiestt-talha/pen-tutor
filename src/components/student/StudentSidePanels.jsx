import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const recentAssignments = [
  "Chemistry Lab Report Due",
  "Physics Problem Set 5",
  "Math Quiz - Chapter 7",
  "English Essay Submission",
]

const announcements = ["New Course Available", "Holiday Schedule", "Exam Timetable", "Fee Payment Reminder"]

const attendanceData = [
  { subject: "Chemistry", attendance: "95%" },
  { subject: "Physics", attendance: "88%" },
  { subject: "Mathematics", attendance: "92%" },
]

export default function StudentSidePanels() {
  return (
    <div className="space-y-6">
      {/* Recent Assignments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-yellow-600">Recent Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentAssignments.map((assignment, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600">• {assignment}</span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </div>
          ))}
          <Button variant="link" className="text-yellow-600 p-0 h-auto text-sm">
            View All Assignments
          </Button>
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-600">Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {announcements.map((announcement, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600">• {announcement}</span>
            </div>
          ))}
          <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
            View All Announcements
          </Button>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-green-500 text-white rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Overall Grade:</span>
              <span className="font-bold">A-</span>
            </div>
          </div>
          <div className="bg-blue-500 text-white rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Class Rank:</span>
              <span className="font-bold">#3</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {attendanceData.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">{item.subject}</span>
              <span className="text-sm font-medium">{item.attendance}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
