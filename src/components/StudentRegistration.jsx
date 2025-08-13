"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Upload } from "lucide-react"

export default function StudentRegistration() {
  const [formData, setFormData] = useState({
    userType: "students",
    // Address fields
    country: "",
    city: "",
    area: "",
    // Record fields
    qualification: "",
    subject: "",
    institute: "",
    experience: "", // for tutors
    specialization: "", // for tutors
    // Study Plan fields
    preferredSubject: "",
    placeToTeach: "",
    timingToTeach: "",
    hourlyRate: "", // for tutors
    availability: "", // for tutors
    // Documents
    documents: {
      cnic: null,
      passport: null,
      profile: null,
      degree: null, // for tutors
      certificate: null, // for tutors
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [activeTab, setActiveTab] = useState("students")

  const steps = ["Address", "Record", "Study Plan", "Documents"]

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()

      // Add basic form data
      Object.keys(formData).forEach((key) => {
        if (key !== "documents") {
          formDataToSend.append(key, formData[key])
        }
      })

      // Add documents
      Object.keys(formData.documents).forEach((docKey) => {
        if (formData.documents[docKey]) {
          formDataToSend.append(docKey, formData.documents[docKey])
        }
      })

      // Send to Django backend
      const response = await fetch("http://your-django-backend.com/api/register/", {
        method: "POST",
        body: formDataToSend,
        // Don't set Content-Type header, let browser set it for FormData
      })

      if (response.ok) {
        const result = await response.json()
        alert("Registration successful!")
        console.log("Registration result:", result)
        // Reset form or redirect user
      } else {
        throw new Error("Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDocumentChange = (docType, file) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: file,
      },
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleTabChange = (value) => {
    setActiveTab(value)
    setFormData((prev) => ({
      ...prev,
      userType: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">PT</span>
              </div>
              <span className="text-xl font-bold text-gray-800">PEN TUTOR</span>
            </div>
          </div>
          <p className="text-gray-600">Register Student - Edited</p>
        </div>

        {/* Step Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {steps.slice(0, 3).map((step, index) => (
            <Card key={step} className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-center">{step}</CardTitle>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="students"
                      className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-xs"
                    >
                      Students
                    </TabsTrigger>
                    <TabsTrigger
                      value="tutor"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs"
                    >
                      Tutor
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="students" className="space-y-4 mt-4">
                    {step === "Address" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Country</label>
                          <Select
                            value={formData.country}
                            onValueChange={(value) => handleInputChange("country", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="pk">Pakistan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add City</label>
                          <Input
                            placeholder="Enter city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Area</label>
                          <Input
                            placeholder="Enter area"
                            value={formData.area}
                            onChange={(e) => handleInputChange("area", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    {step === "Record" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Your Qualification</label>
                          <Input
                            placeholder="Enter qualification"
                            value={formData.qualification}
                            onChange={(e) => handleInputChange("qualification", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Your Subject</label>
                          <Input
                            placeholder="Enter subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange("subject", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Your Institute</label>
                          <Input
                            placeholder="Enter institute"
                            value={formData.institute}
                            onChange={(e) => handleInputChange("institute", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    {step === "Study Plan" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Subject Of Teaching
                          </label>
                          <Input
                            placeholder="Enter subject"
                            value={formData.preferredSubject}
                            onChange={(e) => handleInputChange("preferredSubject", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Place To Teach</label>
                          <Input
                            placeholder="Enter location"
                            value={formData.placeToTeach}
                            onChange={(e) => handleInputChange("placeToTeach", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Timing To Teach</label>
                          <Input
                            placeholder="Enter timing"
                            value={formData.timingToTeach}
                            onChange={(e) => handleInputChange("timingToTeach", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="tutor" className="space-y-4 mt-4">
                    {step === "Address" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add Country</label>
                          <Select
                            value={formData.country}
                            onValueChange={(value) => handleInputChange("country", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="pk">Pakistan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Add City</label>
                          <Input
                            placeholder="Enter city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teaching Location Preference
                          </label>
                          <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home">Student's Home</SelectItem>
                              <SelectItem value="tutor">Tutor's Place</SelectItem>
                              <SelectItem value="online">Online Only</SelectItem>
                              <SelectItem value="both">Both Online & Offline</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    {step === "Record" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                          <Select
                            value={formData.qualification}
                            onValueChange={(value) => handleInputChange("qualification", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select qualification" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                              <SelectItem value="masters">Master's Degree</SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                              <SelectItem value="diploma">Diploma</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teaching Experience (Years)
                          </label>
                          <Input
                            type="number"
                            placeholder="Enter years of experience"
                            value={formData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subject Specialization</label>
                          <Input
                            placeholder="Enter your specialization"
                            value={formData.specialization}
                            onChange={(e) => handleInputChange("specialization", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                    {step === "Study Plan" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subjects You Can Teach</label>
                          <Input
                            placeholder="Enter subjects (comma separated)"
                            value={formData.preferredSubject}
                            onChange={(e) => handleInputChange("preferredSubject", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (USD)</label>
                          <Input
                            type="number"
                            placeholder="Enter hourly rate"
                            value={formData.hourlyRate}
                            onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Available Days & Times</label>
                          <Input
                            placeholder="e.g., Mon-Fri 9AM-5PM"
                            value={formData.availability}
                            onChange={(e) => handleInputChange("availability", e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="rounded-full w-8 h-8 p-0 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex space-x-1">
                    {[0, 1, 2].map((dot) => (
                      <div
                        key={dot}
                        className={`w-2 h-2 rounded-full ${dot === index ? "bg-yellow-500" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>

                  <Button
                    size="sm"
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className="bg-yellow-500 hover:bg-yellow-600 rounded-full w-8 h-8 p-0"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Documents Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-center">Documents</CardTitle>
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
                <TabsTrigger
                  value="students"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white text-xs"
                >
                  Students
                </TabsTrigger>
                <TabsTrigger
                  value="tutor"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs"
                >
                  Tutor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="mt-4">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { key: "cnic", label: "Add CNIC/B-Form" },
                    { key: "passport", label: "Add Passport Picture" },
                    { key: "profile", label: "Add Profile Picture" },
                  ].map((docType) => (
                    <div key={docType.key} className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">{docType.label}</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-yellow-500 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentChange(docType.key, e.target.files[0])}
                          className="hidden"
                          id={`student-${docType.key}`}
                        />
                        <label htmlFor={`student-${docType.key}`} className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {formData.documents[docType.key]
                              ? formData.documents[docType.key].name
                              : "Click to upload or drag and drop"}
                          </p>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tutor" className="mt-4">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { key: "cnic", label: "Add CNIC/B-Form" },
                    { key: "degree", label: "Add Degree Certificate" },
                    { key: "certificate", label: "Add Teaching Certificate" },
                    { key: "profile", label: "Add Profile Picture" },
                  ].map((docType) => (
                    <div key={docType.key} className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">{docType.label}</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleDocumentChange(docType.key, e.target.files[0])}
                          className="hidden"
                          id={`tutor-${docType.key}`}
                        />
                        <label htmlFor={`tutor-${docType.key}`} className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {formData.documents[docType.key]
                              ? formData.documents[docType.key].name
                              : "Click to upload or drag and drop"}
                          </p>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Final Navigation */}
            <div className="flex items-center justify-center mt-8 space-x-6">
              <Button variant="outline" onClick={prevStep} className="rounded-full w-10 h-10 p-0 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex space-x-1">
                {[0, 1, 2].map((dot) => (
                  <div key={dot} className={`w-2 h-2 rounded-full ${dot === 2 ? "bg-yellow-500" : "bg-gray-300"}`} />
                ))}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-2 rounded-lg text-white font-semibold ${
                  activeTab === "students" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
