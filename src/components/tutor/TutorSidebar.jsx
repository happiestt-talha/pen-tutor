"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
  FileText,
  Calendar,
  CreditCard,
  BookOpen,
  Briefcase,
  MessageSquare,
  Users,
  UserPlus,
  LogOut,
} from "lucide-react"

const navigationItems = [
  { name: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/tutor/profile", icon: User },
  { name: "Agreement", href: "/tutor/agreement", icon: FileText },
  { name: "Class Schedule", href: "/tutor/schedule", icon: Calendar },
  { name: "Record of Payment", href: "/tutor/payments", icon: CreditCard },
  { name: "Courses of Material", href: "/tutor/courses", icon: BookOpen },
  { name: "Job Board", href: "/tutor/jobs", icon: Briefcase },
  { name: "Student Request", href: "/tutor/requests", icon: MessageSquare },
  { name: "Become Featured Tutors", href: "/tutor/featured", icon: Users },
  { name: "Become Pentutor Affiliate", href: "/tutor/affiliate", icon: UserPlus },
]

export default function TutorSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* User Profile Section */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/placeholder.svg?height=80&width=80&text=Tutor"
              alt="Maryam Safdar"
              width={80}
              height={80}
              className="rounded-full border-4 border-white object-cover"
            />
          </div>
          <h3 className="font-semibold text-lg">Maryam Safdar</h3>
          <p className="text-blue-200 text-sm">Level 2</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4">
        <button className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors w-full text-sm">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
