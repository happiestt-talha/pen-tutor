import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const courses = [
  { name: "English", progress: 20, color: "bg-yellow-500" },
  { name: "French", progress: 10, color: "bg-cyan-500" },
  { name: "Web Development", progress: 40, color: "bg-red-500" },
]

export default function QuickOverview() {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold">Quick Overview</CardTitle>
          <p className="text-blue-100">Courses & Tutions</p>
        </div>
        <div className="flex items-center space-x-2 text-blue-100 hover:text-white cursor-pointer">
          <span>Courses</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {courses.map((course) => (
            <div key={course.name} className={`${course.color} rounded-lg p-4 text-white`}>
              <h3 className="font-semibold text-lg mb-2">{course.name}</h3>
              <p className="text-sm opacity-90">{course.progress}% Completed</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
