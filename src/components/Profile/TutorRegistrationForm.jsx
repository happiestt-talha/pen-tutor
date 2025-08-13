"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, User, MapPin, GraduationCap, Briefcase } from "lucide-react"
import { toast } from "sonner"
import Loader from "@/components/shared/Loader"
import { useAuth } from "../auth/AuthContext"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function TutorRegistrationForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile_number_1: "",
    mobile_number_2: "",
    date_of_birth: "",
    city: "",
    country: "",
    area: "",
    location: "",
    organization_name: "",
    designation: "",
    level: "",
    member_since: "",
    salary_package: "",
    timings_required: "",
    bio: "",
    experience: "",
    areas_to_teach: "",
    age: "",
    can_teach_online: false,
    minimum_qualification_required: "",
    experience_required: "",
    subjects: [], // Array of subject IDs
    qualifications: [], // Array of qualification IDs
    cnic: "",
    // File fields
    cnic_front: null,
    cnic_back: null,
    profile_image: null,
    degree_image: null,
  })

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileNames, setFileNames] = useState({
    cnic_front: "",
    cnic_back: "",
    profile_image: "",
    degree_image: "",
  })

  const [availableSubjects, setAvailableSubjects] = useState([
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" },
    { id: 4, name: "Biology" },
    { id: 5, name: "English" },
    { id: 6, name: "Computer Science" },
  ])

  const [availableQualifications, setAvailableQualifications] = useState([
    { id: 1, name: "Bachelor's Degree" },
    { id: 2, name: "Master's Degree" },
    { id: 3, name: "PhD" },
    { id: 4, name: "Teaching Certificate" },
  ])

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const timezoneOptions = [
    { value: "GMT-12:00", label: "GMT-12:00 (Baker Island)" },
    { value: "GMT-11:00", label: "GMT-11:00 (American Samoa)" },
    { value: "GMT-10:00", label: "GMT-10:00 (Hawaii)" },
    { value: "GMT-09:00", label: "GMT-09:00 (Alaska)" },
    { value: "GMT-08:00", label: "GMT-08:00 (Pacific Time)" },
    { value: "GMT-07:00", label: "GMT-07:00 (Mountain Time)" },
    { value: "GMT-06:00", label: "GMT-06:00 (Central Time)" },
    { value: "GMT-05:00", label: "GMT-05:00 (Eastern Time)" },
    { value: "GMT-04:00", label: "GMT-04:00 (Atlantic Time)" },
    { value: "GMT-03:00", label: "GMT-03:00 (Brazil)" },
    { value: "GMT-02:00", label: "GMT-02:00 (Mid-Atlantic)" },
    { value: "GMT-01:00", label: "GMT-01:00 (Azores)" },
    { value: "GMT+00:00", label: "GMT+00:00 (London, Dublin)" },
    { value: "GMT+01:00", label: "GMT+01:00 (Paris, Berlin)" },
    { value: "GMT+02:00", label: "GMT+02:00 (Cairo, Athens)" },
    { value: "GMT+03:00", label: "GMT+03:00 (Moscow, Nairobi)" },
    { value: "GMT+04:00", label: "GMT+04:00 (Dubai, Baku)" },
    { value: "GMT+05:00", label: "GMT+05:00 (Karachi, Tashkent)" },
    { value: "GMT+05:30", label: "GMT+05:30 (India, Sri Lanka)" },
    { value: "GMT+06:00", label: "GMT+06:00 (Dhaka, Almaty)" },
    { value: "GMT+07:00", label: "GMT+07:00 (Bangkok, Jakarta)" },
    { value: "GMT+08:00", label: "GMT+08:00 (Beijing, Singapore)" },
    { value: "GMT+09:00", label: "GMT+09:00 (Tokyo, Seoul)" },
    { value: "GMT+10:00", label: "GMT+10:00 (Sydney, Melbourne)" },
    { value: "GMT+11:00", label: "GMT+11:00 (Solomon Islands)" },
    { value: "GMT+12:00", label: "GMT+12:00 (New Zealand)" },
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token || !user.id) {
          toast.error("Authentication required.")
          return
        }
        const response = await axios.get(`${API_BASE}/api/auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.status === 200) {
          const { data } = response.data
          setFormData({
            full_name: data.full_name || "",
            email: data.email || "",
            mobile_number_1: data.mobile_number_1 || "",
            mobile_number_2: data.mobile_number_2 || "",
            date_of_birth: data.date_of_birth || "",
            city: data.city || "",
            country: data.country || "",
            area: data.area || "",
            location: data.location || "",
            organization_name: data.organization_name || "",
            designation: data.designation || "",
            level: data.level || "",
            member_since: data.member_since || "",
            salary_package: data.salary_package || "",
            timings_required: data.timings_required || "",
            bio: data.bio || "",
            experience: data.experience || "",
            areas_to_teach: data.areas_to_teach || "",
            age: data.age || "",
            can_teach_online: data.can_teach_online || false,
            minimum_qualification_required: data.minimum_qualification_required || "",
            experience_required: data.experience_required || "",
            subjects: data.subjects || [],
            qualifications: data.qualifications || [],
            cnic: data.cnic || "",
            cnic_front: null,
            cnic_back: null,
            profile_image: null,
            degree_image: null,
          })
        } else {
          toast.error("Failed to load profile data.")
        }
      } catch (error) {
        toast.error("Something went wrong while loading profile data.")
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user.id])

  const validateCNIC = (cnic) => {
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/
    return cnicPattern.test(cnic)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "cnic") {
      if (!validateCNIC(value) && value !== "") {
        toast.error("CNIC format should be xxxxx-xxxxxxx-x")
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
      setFileNames((prev) => ({ ...prev, [fieldName]: file.name }))
    }
  }

  const handleSubjectToggle = (subjectId) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter((id) => id !== subjectId)
        : [...prev.subjects, subjectId],
    }))
  }

  const handleQualificationToggle = (qualificationId) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.includes(qualificationId)
        ? prev.qualifications.filter((id) => id !== qualificationId)
        : [...prev.qualifications, qualificationId],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.full_name || !formData.email || !formData.mobile_number_1) {
      toast.error("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    if (formData.cnic && !validateCNIC(formData.cnic)) {
      toast.error("Please enter a valid CNIC format (xxxxx-xxxxxxx-x)")
      setIsSubmitting(false)
      return
    }

    const data = new FormData()

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        if (key === "subjects" || key === "qualifications") {
          // Send arrays as JSON string for multipart form data
          data.append(key, JSON.stringify(formData[key]))
        } else if (key === "can_teach_online") {
          // Ensure boolean is sent correctly
          data.append(key, formData[key].toString())
        } else if (formData[key] instanceof File) {
          data.append(key, formData[key])
        } else {
          data.append(key, formData[key])
        }
      }
    })

    try {
      const token = localStorage.getItem("access_token")
      const response = await axios.post(`${API_BASE}/api/jobs/tutor/register`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success("Profile updated successfully!")
        router.push("/tutor/dashboard")
      } else {
        const errorData = await response.data
        toast.error(`Failed to update profile: ${JSON.stringify(errorData)}`)
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <Loader text="Loading Profile..." />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutor Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="mobile_number_1"
                value={formData.mobile_number_1}
                onChange={handleInputChange}
                placeholder="Primary Mobile Number"
                required
              />
              <Input
                name="mobile_number_2"
                value={formData.mobile_number_2}
                onChange={handleInputChange}
                placeholder="Secondary Mobile (Optional)"
              />
              <Input name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="Age" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                placeholder="Date of Birth (YYYY-MM-DD)"
              />
              <Input
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                placeholder="CNIC (xxxxx-xxxxxxx-x)"
              />
            </div>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="A brief bio about your teaching style and experience"
            />
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin />
              Location & Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" />
              <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="area" value={formData.area} onChange={handleInputChange} placeholder="Area/District" />
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Specific Location/Address"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Briefcase />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="organization_name"
                value={formData.organization_name}
                onChange={handleInputChange}
                placeholder="Current Organization"
              />
              <Input
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Current Designation"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select onValueChange={(value) => handleSelectChange("level", value)} value={formData.level}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Years of Experience"
              />
              <Input
                name="salary_package"
                value={formData.salary_package}
                onChange={handleInputChange}
                placeholder="Expected Salary Package"
              />
            </div>
            <Input
              name="timings_required"
              value={formData.timings_required}
              onChange={handleInputChange}
              placeholder="Preferred Teaching Timings"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="can_teach_online"
                checked={formData.can_teach_online}
                onCheckedChange={(checked) => handleCheckboxChange("can_teach_online", checked)}
              />
              <label htmlFor="can_teach_online" className="text-sm font-medium">
                Can teach online
              </label>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <GraduationCap />
              Academic & Teaching
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="minimum_qualification_required"
                value={formData.minimum_qualification_required}
                onChange={handleInputChange}
                placeholder="Minimum Qualification Required"
              />
              <Input
                name="experience_required"
                value={formData.experience_required}
                onChange={handleInputChange}
                placeholder="Experience Required"
              />
            </div>
            <Textarea
              name="areas_to_teach"
              value={formData.areas_to_teach}
              onChange={handleInputChange}
              placeholder="Detailed description of areas you can teach"
            />

            {/* Subjects Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subjects (Select multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSubjects.map((subject) => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`subject-${subject.id}`}
                      checked={formData.subjects.includes(subject.id)}
                      onCheckedChange={() => handleSubjectToggle(subject.id)}
                    />
                    <label htmlFor={`subject-${subject.id}`} className="text-sm">
                      {subject.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Qualifications Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Qualifications (Select multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableQualifications.map((qualification) => (
                  <div key={qualification.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`qualification-${qualification.id}`}
                      checked={formData.qualifications.includes(qualification.id)}
                      onCheckedChange={() => handleQualificationToggle(qualification.id)}
                    />
                    <label htmlFor={`qualification-${qualification.id}`} className="text-sm">
                      {qualification.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Upload />
              Document Uploads
            </h3>

            {/* Profile Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="profile_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "profile_image")}
                  className="hidden"
                />
                <label htmlFor="profile_image" className="cursor-pointer">
                  <p className="text-gray-500">{fileNames.profile_image || "Click to upload profile image"}</p>
                </label>
              </div>
            </div>

            {/* CNIC Front */}
            <div className="space-y-2">
              <label className="text-sm font-medium">CNIC Front Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="cnic_front"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cnic_front")}
                  className="hidden"
                />
                <label htmlFor="cnic_front" className="cursor-pointer">
                  <p className="text-gray-500">{fileNames.cnic_front || "Click to upload CNIC front image"}</p>
                </label>
              </div>
            </div>

            {/* CNIC Back */}
            <div className="space-y-2">
              <label className="text-sm font-medium">CNIC Back Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="cnic_back"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cnic_back")}
                  className="hidden"
                />
                <label htmlFor="cnic_back" className="cursor-pointer">
                  <p className="text-gray-500">{fileNames.cnic_back || "Click to upload CNIC back image"}</p>
                </label>
              </div>
            </div>

            {/* Degree Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Degree/Certificate Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  id="degree_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "degree_image")}
                  className="hidden"
                />
                <label htmlFor="degree_image" className="cursor-pointer">
                  <p className="text-gray-500">
                    {fileNames.degree_image || "Click to upload degree/certificate image"}
                  </p>
                </label>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader text="Saving..." /> : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
