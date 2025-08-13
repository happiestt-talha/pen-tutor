import { Calendar } from "lucide-react"

export default function ProfileHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome To Profile</h1>
        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">5 July 2021</span>
        </div>
      </div>
    </header>
  )
}
