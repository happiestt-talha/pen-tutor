"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Calendar,
  CreditCard,
  FileText,
  Home,
  BarChart3,
  User,
  LogOut,
} from "lucide-react"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Request", href: "/dashboard/request", icon: MessageSquare },
  { name: "Attendance", href: "/dashboard/attendance", icon: Calendar },
  { name: "Payment Record", href: "/dashboard/payments", icon: CreditCard },
  { name: "Agreement", href: "/dashboard/agreement", icon: FileText },
  { name: "Home Tuition", href: "/dashboard/home-tuition", icon: Home },
  { name: "Report", href: "/dashboard/report", icon: BarChart3 },
]

export default function StudentSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      {/* User Profile Section */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <Image
              src="/placeholder.svg?height=80&width=80&text=Student"
              alt="Maryam Safdar"
              width={80}
              height={80}
              className="rounded-full border-4 border-white object-cover"
            />
          </div>
          <h3 className="font-semibold text-lg">Maryam Safdar</h3>
          <p className="text-yellow-100 text-sm">Student</p>
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
                      ? "bg-yellow-50 text-yellow-600 font-medium"
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
