import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, BookOpen, Clock } from "lucide-react"

const courses = [
  {
    id: "CRS001",
    title: "O Level Chemistry",
    tutor: "Dr. Sarah Johnson",
    progress: 65,
    totalLessons: 20,
    completedLessons: 13,
    nextClass: "Tomorrow 10:00 AM",
    color: "bg-yellow-500",
    icon: "🧪",
  },
  {
    id: "CRS002",
    title: "A Level Physics",
    tutor: "Prof. Michael Chen",
    progress: 40,
    totalLessons: 25,
    completedLessons: 10,
    nextClass: "Friday 2:00 PM",
    color: "bg-cyan-500",
    icon: "⚛️",
  },
  {
    id: "CRS003",
    title: "O Level Mathematics",
    tutor: "Ms. Emily Davis",
    progress: 80,
    totalLessons: 18,
    completedLessons: 14,
    nextClass: "Monday 4:00 PM",
    color: "bg-green-500",
    icon: "📐",
  },
]

export default function EnrolledCourses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">My Enrolled Courses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${course.color} text-white rounded-lg p-3`}>
                    <span className="text-2xl">{course.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{course.progress}%</div>
                    <div className="text-sm text-gray-500">Complete</div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">by {course.tutor}</p>

                <div className="space-y-3 mb-4">
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>
                        {course.completedLessons}/{course.totalLessons} Lessons
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.nextClass}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
