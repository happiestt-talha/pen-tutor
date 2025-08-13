"use client"
import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, BookOpen, DollarSign, Users, Video } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CreateCoursePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    courseType: "",
    isActive: true,
    hasLiveClasses: false,
    subject: "",
  })

  const handleInputChange = (field , value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_BASE}/api/teacher/courses/`, {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        course_type: formData.courseType,
        is_active: formData.isActive,
        has_live_classes: formData.hasLiveClasses,
        subject: formData.subject,
      })
      console.log("course created response", response)
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Course created successfully!",
        })
        router.push(`/courses/details/${response.data.data.id}`)
      }
    } catch (error) {
      console.log("course created error", error)
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-[#313D6A] hover:bg-[#313D6A]/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-[#313D6A]" />
                <h1 className="text-xl font-semibold text-[#313D6A]">Create New Course</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="bg-[#313D6A] py-2 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Information</span>
                </CardTitle>
                <CardDescription className="text-gray-200">
                  Fill in the details to create your new course
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[#313D6A] font-medium">
                      Course Title *
                    </Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter course title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[#313D6A] font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[#313D6A] font-medium">
                      Course Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what students will learn in this course"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                      rows={4}
                      className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]"
                    />
                  </div>

                  {/* Course Type and Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="courseType" className="text-[#313D6A] font-medium">
                        Course Type *
                      </Label>
                      <Select
                        value={formData.courseType}
                        onValueChange={(value) => handleInputChange("courseType", value)}
                        required
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07]">
                          <SelectValue placeholder="Select course type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-[#313D6A] font-medium">
                        Price {formData.courseType === "paid" && "*"}
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="text"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => handleInputChange("price", e.target.value)}
                          required={formData.courseType === "paid"}
                          disabled={formData.courseType === "free"}
                          className="pl-10 border-gray-300 focus:border-[#F5BB07] focus:ring-[#F5BB07] disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Switches */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-[#313D6A]" />
                        <div>
                          <Label htmlFor="isActive" className="text-[#313D6A] font-medium">
                            Course Active
                          </Label>
                          <p className="text-sm text-gray-600">Make this course available to students</p>
                        </div>
                      </div>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                        className="data-[state=checked]:bg-[#F5BB07]"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="h-5 w-5 text-[#313D6A]" />
                        <div>
                          <Label htmlFor="hasLiveClasses" className="text-[#313D6A] font-medium">
                            Live Classes
                          </Label>
                          <p className="text-sm text-gray-600">Include live interactive sessions</p>
                        </div>
                      </div>
                      <Switch
                        id="hasLiveClasses"
                        checked={formData.hasLiveClasses}
                        onCheckedChange={(checked) => handleInputChange("hasLiveClasses", checked)}
                        className="data-[state=checked]:bg-[#F5BB07]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-[#313D6A] font-semibold px-8 py-2"
                    >
                      {isLoading ? "Creating..." : "Create Course"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm sticky top-8">
              <CardHeader className="bg-[#313D6A] py-2 text-white">
                <CardTitle className="text-lg">Course Preview</CardTitle>
                <CardDescription className="text-gray-200">How your course will appear</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#313D6A] text-lg">{formData.title || "Course Title"}</h3>
                    <p className="text-sm text-gray-600 mt-1">{formData.subject || "Subject"}</p>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">
                    {formData.description || "Course description will appear here..."}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          formData.courseType === "free"
                            ? "bg-green-100 text-green-800"
                            : "bg-[#F5BB07]/20 text-[#313D6A]"
                        }`}
                      >
                        {formData.courseType || "Type"}
                      </span>
                      {formData.hasLiveClasses && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Live</span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[#313D6A]">
                      {formData.courseType === "free" ? "Free" : `$${formData.price || "0.00"}`}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Status:</span>
                    <span className={`font-medium ${formData.isActive ? "text-green-600" : "text-gray-500"}`}>
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
