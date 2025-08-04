import StudentDashboardLayout from "@/components/student/StudentDashboardLayout"
import ProfileForm from "@/components/profile/ProfileForm"

export default function StudentProfilePage() {
  // In a real app, you'd get this from authentication context
  const userId = "current-student-id"

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <ProfileForm userId={userId} />
      </div>
    </StudentDashboardLayout>
  )
}
