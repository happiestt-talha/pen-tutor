import StudentSidebar from "./StudentSidebar"
import StudentHeader from "./StudentHeader"

export default function StudentDashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
