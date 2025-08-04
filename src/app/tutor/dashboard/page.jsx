import TutorDashboardLayout from "@/components/tutor/TutorDashboardLayout"
import UpcomingSessions from "@/components/tutor/UpcomingSessions"
import ScheduledClasses from "@/components/tutor/ScheduledClasses"
import VideoCourses from "@/components/tutor/VideoCourses"
import OnlineResources from "@/components/tutor/OnlineResources"
import TutorSidePanels from "@/components/tutor/TutorSidePanels"

export default function TutorDashboardPage() {
  return (
    <TutorDashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <UpcomingSessions />
          <ScheduledClasses />
          <VideoCourses />
          <OnlineResources />
        </div>

        {/* Side Panels */}
        <div className="lg:col-span-1">
          <TutorSidePanels />
        </div>
      </div>
    </TutorDashboardLayout>
  )
}
