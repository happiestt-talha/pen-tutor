import TutorDashboardLayout from "@/components/tutor/TutorDashboardLayout"

export default function TutorPaymentsPage() {
  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Records</h1>
        <p className="text-gray-600">Track your earnings and payment history.</p>
        {/* Payment content will go here */}
      </div>
    </TutorDashboardLayout>
  )
}
