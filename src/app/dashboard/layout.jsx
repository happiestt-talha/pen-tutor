import ProtectedRoute from "@/components/auth/ProtectedRoute"

export const metadata = {
  title: "Student Dashboard - Pen Tutor",
  description: "Student dashboard for managing courses and progress",
}

export default function DashboardLayout({ children }) {
  return <ProtectedRoute requiredRole="student">{children}</ProtectedRoute>
}
