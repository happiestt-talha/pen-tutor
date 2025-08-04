import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Users } from "lucide-react"

const courses = [
  {
    id: "VC001",
    title: "O Level Chemistry",
    color: "bg-yellow-500",
    icon: "🧪",
    students: 25,
    lessons: 12,
  },
  {
    id: "VC002",
    title: "O Level Physics",
    color: "bg-cyan-500",
    icon: "⚛️",
    students: 18,
    lessons: 15,
  },
  {
    id: "VC003",
    title: "O Level Computer",
    color: "bg-red-500",
    icon: "💻",
    students: 30,
    lessons: 20,
  },
]

export default function VideoCourses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800 text-center">My Video Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className={`${course.color} text-white rounded-lg p-6 text-center`}>
              <div className="text-4xl mb-4">{course.icon}</div>
              <h3 className="text-lg font-bold mb-4">{course.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{course.students} Students</span>
                </div>
                <div className="text-sm opacity-90">{course.lessons} Lessons</div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Play className="h-4 w-4 mr-2" />
                Manage Course
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
