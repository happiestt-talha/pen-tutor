import StudentDashboardLayout from "@/components/student/StudentDashboardLayout"
import UpcomingClasses from "@/components/student/UpcomingClasses"
import EnrolledCourses from "@/components/student/EnrolledCourses"
import QuickActions from "@/components/student/QuickActions"
import StudentSidePanels from "@/components/student/StudentSidePanels"

export default function StudentDashboardPage() {
  return (
    <StudentDashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <UpcomingClasses />
          <EnrolledCourses />
          <QuickActions />
        </div>

        {/* Side Panels */}
        <div className="lg:col-span-1">
          <StudentSidePanels />
        </div>
      </div>
    </StudentDashboardLayout>
  )
}
