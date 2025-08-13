"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Loader from "@/components/shared/Loader"

export default function CreateClassForm() {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    tutor_id: "",
    scheduled_time: "",
    duration: "60",
  })
  const [tutors, setTutors] = useState([])
  const [loadingTutors, setLoadingTutors] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/tutors/`)
        if (response.ok) {
          const data = await response.json()
          setTutors(data.results || [])
        } else {
          toast.error("Failed to load tutors list.")
        }
      } catch (error) {
        toast.error("An error occurred while fetching tutors.")
      } finally {
        setLoadingTutors(false)
      }
    }
    fetchTutors()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_BASE}/api/classes/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Class request sent successfully!")
        router.push("/student/dashboard")
      } else {
        const errorData = await response.json()
        toast.error(`Failed to create class: ${JSON.stringify(errorData)}`)
      }
    } catch (error) {
      toast.error("An error occurred while creating the class.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Request a New Class</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Class Title (e.g., Algebra 1 Basics)" required />
          <Input name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Subject (e.g., Mathematics)" required />
          
          <Select name="tutor_id" onValueChange={(value) => handleSelectChange("tutor_id", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a Tutor" />
            </SelectTrigger>
            <SelectContent>
              {loadingTutors ? (
                <div className="p-4 text-center">Loading tutors...</div>
              ) : (
                tutors.map((tutor) => (
                  <SelectItem key={tutor.id} value={tutor.id.toString()}>
                    {tutor.first_name} {tutor.last_name} ({tutor.profile?.teaching_subjects?.join(", ") || "General"})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Input name="scheduled_time" type="datetime-local" value={formData.scheduled_time} onChange={handleInputChange} required />

          <Select name="duration" onValueChange={(value) => handleSelectChange("duration", value)} value={formData.duration}>
            <SelectTrigger>
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
              <SelectItem value="90">1.5 hours</SelectItem>
              <SelectItem value="120">2 hours</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader text="Sending Request..." /> : "Send Class Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
