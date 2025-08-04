import DashboardLayout from "@/components/dashboard/DashboardLayout"

export default function AttendancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600">View your attendance records and statistics.</p>
        {/* Attendance content will go here */}
      </div>
    </DashboardLayout>
  )
}
