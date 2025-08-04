import TutorSidebar from "./TutorSidebar"
import TutorHeader from "./TutorHeader"

export default function TutorDashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <TutorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TutorHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
