import ProtectedRoute from "@/components/auth/ProtectedRoute"

export const metadata = {
  title: "Tutor Dashboard - Pen Tutor",
  description: "Tutor dashboard for managing students and classes",
}

export default function TutorLayout({ children }) {
  return <ProtectedRoute requiredRole="tutor">{children}</ProtectedRoute>
}
