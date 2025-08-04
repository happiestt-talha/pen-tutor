"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SearchBar({ onSearch, placeholder = "Search Anything" }) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)

  // Mock search data - replace with actual API calls
  const searchData = [
    { type: "student", id: "PTS100", name: "Muhammad Ahmad", subject: "Chemistry" },
    { type: "student", id: "PTS200", name: "Sarah Khan", subject: "Physics" },
    { type: "session", id: "SES001", title: "Chemistry Session", time: "10:00 AM" },
    { type: "course", id: "CRS001", title: "O Level Chemistry", students: 25 },
    { type: "resource", id: "RES001", title: "Chemistry Past Papers", type: "PDF" },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    setIsOpen(true)

    // Simulate API call
    setTimeout(() => {
      const filteredResults = searchData.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setResults(filteredResults)
      setLoading(false)
    }, 300)

    // Call parent search handler
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    handleSearch(value)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  const getResultIcon = (type) => {
    switch (type) {
      case "student":
        return "👨‍🎓"
      case "session":
        return "📅"
      case "course":
        return "📚"
      case "resource":
        return "📄"
      default:
        return "🔍"
    }
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-10 bg-gray-50 border-gray-200"
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setQuery(result.name || result.title)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getResultIcon(result.type)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{result.name || result.title}</div>
                        <div className="text-xs text-gray-500">
                          {result.type === "student" && `${result.id} • ${result.subject}`}
                          {result.type === "session" && `${result.time} • Session`}
                          {result.type === "course" && `${result.students} students`}
                          {result.type === "resource" && result.type}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center text-gray-500">No results found</div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
