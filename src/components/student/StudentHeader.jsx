"use client"

import { Bell, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/shared/SearchBar"

export default function StudentHeader() {
  const handleSearch = (query) => {
    console.log("Searching for:", query)
    // Implement search logic here
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-gray-900">Welcome To Dashboard</h1>
          <div className="flex items-center space-x-2 text-gray-500">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">5 July 2021</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <SearchBar onSearch={handleSearch} />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-yellow-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>

  )
}
