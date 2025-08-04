import TutorDashboardLayout from "@/components/tutor/TutorDashboardLayout"
import ProfileForm from "@/components/profile/ProfileForm"

export default function TutorProfilePage() {
  // In a real app, you'd get this from authentication context
  const userId = "current-tutor-id"

  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        <ProfileForm userId={userId} />
      </div>
    </TutorDashboardLayout>
  )
}
