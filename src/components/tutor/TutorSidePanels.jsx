import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const recentJobs = [
  "O/A Levels Tutors Required",
  "O/A Levels Tutors Required",
  "O/A Levels Tutors Required",
  "O/A Levels Tutors Required",
]

const notices = ["Notice No. 1", "Notice No. 2", "Notice No. 3", "Notice No. 4"]

const attendanceData = [
  { code: "PTS-100", classes: "1 Class" },
  { code: "PTS-200", classes: "2 Classes" },
  { code: "PTS-300", classes: "3 Classes" },
]

export default function TutorSidePanels() {
  return (
    <div className="space-y-6">
      {/* Recent Jobs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-yellow-600">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentJobs.map((job, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600">• {job}</span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </div>
          ))}
          <Button variant="link" className="text-yellow-600 p-0 h-auto text-sm">
            View All Jobs
          </Button>
        </CardContent>
      </Card>

      {/* Notice Board */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-blue-600">Notice Board</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {notices.map((notice, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-600">• {notice}</span>
            </div>
          ))}
          <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
            View All Notices
          </Button>
        </CardContent>
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-gray-600 text-white rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Received Payment:</span>
              <span className="font-bold">1500 RS</span>
            </div>
          </div>
          <div className="bg-red-500 text-white rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending Payment:</span>
              <span className="font-bold">2500 RS</span>
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
              <span className="text-sm text-gray-600">{item.code}</span>
              <span className="text-sm font-medium">{item.classes}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
