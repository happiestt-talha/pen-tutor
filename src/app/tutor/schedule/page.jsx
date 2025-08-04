import TutorDashboardLayout from "@/components/tutor/TutorDashboardLayout"

export default function TutorSchedulePage() {
  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
        <p className="text-gray-600">Manage your class schedules and timings.</p>
        {/* Schedule content will go here */}
      </div>
    </TutorDashboardLayout>
  )
}
