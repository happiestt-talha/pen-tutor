import DashboardLayout from "@/components/dashboard/DashboardLayout"

export default function CoursesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-600">Manage your courses and track progress.</p>
        {/* Course content will go here */}
      </div>
    </DashboardLayout>
  )
}
