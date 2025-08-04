import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const attendanceData = [
  { week: "1st Week", absents: 2 },
  { week: "2nd Week", absents: 1 },
  { week: "3rd Week", absents: 0 },
]

export default function AttendanceCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Attendance</CardTitle>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attendanceData.map((item) => (
            <div key={item.week} className="flex justify-between items-center">
              <span className="text-gray-600">{item.week}</span>
              <span className="text-gray-900 font-medium">{item.absents} Absents</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
