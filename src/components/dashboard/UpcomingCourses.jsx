import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Globe, Castle } from "lucide-react"

const upcomingCourses = [
  {
    name: "Calculus",
    courses: 10,
    color: "bg-yellow-500",
    icon: Calculator,
  },
  {
    name: "German",
    courses: 10,
    color: "bg-cyan-500",
    icon: Globe,
  },
  {
    name: "History",
    courses: 10,
    color: "bg-red-500",
    icon: Castle,
  },
]

export default function UpcomingCourses() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Upcoming Courses / Tuition</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingCourses.map((course) => {
          const Icon = course.icon
          return (
            <Card key={course.name} className={`${course.color} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-8 w-8 opacity-80" />
                </div>
                <h3 className="text-xl font-bold mb-1">{course.name}</h3>
                <p className="text-sm opacity-90 mb-4">{course.courses} Courses</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Start Now
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
