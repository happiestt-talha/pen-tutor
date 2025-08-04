import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, CreditCard, FileText, BookOpen, Users } from "lucide-react"

const quickActions = [
  {
    title: "Find Tutor",
    description: "Search for qualified tutors",
    icon: Users,
    color: "bg-blue-500",
    href: "/dashboard/find-tutor",
  },
  {
    title: "Schedule Class",
    description: "Book a new session",
    icon: Calendar,
    color: "bg-green-500",
    href: "/dashboard/schedule",
  },
  {
    title: "Messages",
    description: "Chat with tutors",
    icon: MessageSquare,
    color: "bg-purple-500",
    href: "/dashboard/messages",
  },
  {
    title: "Assignments",
    description: "View pending tasks",
    icon: FileText,
    color: "bg-orange-500",
    href: "/dashboard/assignments",
  },
  {
    title: "Study Materials",
    description: "Access resources",
    icon: BookOpen,
    color: "bg-cyan-500",
    href: "/dashboard/materials",
  },
  {
    title: "Payments",
    description: "Manage billing",
    icon: CreditCard,
    color: "bg-red-500",
    href: "/dashboard/payments",
  },
]

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow bg-transparent"
                asChild
              >
                <a href={action.href}>
                  <div className={`${action.color} text-white rounded-lg p-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
