"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Upload,
  User,
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  Calendar1,
  Clock,
  FileText,
  CreditCard,
} from "lucide-react"
import { toast } from "sonner"
import Loader from "@/components/shared/Loader"
import { useAuth } from "../auth/AuthContext"
import axios from "axios"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for qualifications and subjects - replace with actual API data
const QUALIFICATIONS = [
  { id: 1, name: "Matric" },
  { id: 2, name: "Intermediate" },
  { id: 3, name: "Bachelor's" },
  { id: 4, name: "Master's" },
  { id: 5, name: "PhD" },
]

const SUBJECTS = [
  { id: 1, name: "Mathematics" },
  { id: 2, name: "Physics" },
  { id: 3, name: "Chemistry" },
  { id: 4, name: "Biology" },
  { id: 5, name: "English" },
  { id: 6, name: "Computer Science" },
]

export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    cnic: "",

    // Location
    country: "Pakistan",
    city: "",
    area: "",
    timezone: "",

    // Academic Information
    highest_qualification: "",
    qualifications: [], // Array of IDs
    subjects: [], // Array of IDs
    institute: "",

    // Study Preferences
    preffered_method: "", // Note: double 'f' as requested
    days_to_study: "",
    timing_to_study: "",

    // File uploads
    profile_picture: null,
    cnic_or_form_b_picture: null,
    degree: null,
  })

  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dateOfBirth, setDateOfBirth] = useState(null)
  const [fileNames, setFileNames] = useState({
    profile_picture: "",
    cnic_or_form_b_picture: "",
    degree: "",
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          toast.error("Authentication required.")
          return
        }
        console.log("user at student registration form", user)
        const response = await axios.get(`${API_BASE}/api/auth/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("response at student registration form", response)

        if (response.status === 200) {
          const {data} = response.data
          console.log("data at student registration form", data)
          setFormData({
            name: data.name || "",
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            date_of_birth: data.date_of_birth || "",
            cnic: data.cnic || "",
            country: data.profile?.country || "Pakistan",
            city: data.profile?.city || "",
            area: data.profile?.area || "",
            timezone: data.profile?.timezone || "",
            highest_qualification: data.profile?.highest_qualification || "",
            qualifications: data.profile?.qualifications || [],
            subjects: data.profile?.subjects || [],
            institute: data.profile?.institute || "",
            preffered_method: data.profile?.preffered_method || "",
            days_to_study: data.profile?.days_to_study || "",
            timing_to_study: data.profile?.timing_to_study || "",
            profile_picture: null,
            cnic_or_form_b_picture: null,
            degree: null,
          })

          if (data.date_of_birth) {
            setDateOfBirth(new Date(data.date_of_birth))
          }
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

    if (user?.id) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [user?.id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (name, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
    }))
  }

  const handleDateChange = (date) => {
    setDateOfBirth(date)
    setFormData((prev) => ({
      ...prev,
      date_of_birth: date ? format(date, "yyyy-MM-dd") : "",
    }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, [fieldName]: file }))
      setFileNames((prev) => ({ ...prev, [fieldName]: file.name }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data = new FormData()

    // Append all form data
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        if (Array.isArray(formData[key])) {
          // Handle arrays by appending each item
          formData[key].forEach((item) => {
            data.append(`${key}[]`, item)
          })
        } else {
          data.append(key, formData[key])
        }
      }
    })

    try {
      const token = localStorage.getItem("access_token")
      console.log("token at student registration form", token)
      const response = await axios.post(`${API_BASE}/api/jobs/student/register`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        toast.success("Profile registered successfully!")
      } else {
        const errorData = await response.data
        toast.error(`Failed to register profile: ${JSON.stringify(errorData)}`)
      }
    } catch (error) {
      toast.error("An error occurred while registering your profile.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <Loader text="Loading Profile..." />
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Student Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar1 className="h-4 w-4" />
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground",
                      )}
                    >
                      <Calendar1 className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateOfBirth} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnic" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  CNIC
                </Label>
                <Input
                  id="cnic"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  placeholder="CNIC Number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Area/Locality"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select onValueChange={(value) => handleSelectChange("timezone", value)} value={formData.timezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GMT-12:00">GMT-12:00</SelectItem>
                    <SelectItem value="GMT-11:00">GMT-11:00</SelectItem>
                    <SelectItem value="GMT-10:00">GMT-10:00</SelectItem>
                    <SelectItem value="GMT-09:00">GMT-09:00</SelectItem>
                    <SelectItem value="GMT-08:00">GMT-08:00</SelectItem>
                    <SelectItem value="GMT-07:00">GMT-07:00</SelectItem>
                    <SelectItem value="GMT-06:00">GMT-06:00</SelectItem>
                    <SelectItem value="GMT-05:00">GMT-05:00</SelectItem>
                    <SelectItem value="GMT-04:00">GMT-04:00</SelectItem>
                    <SelectItem value="GMT-03:00">GMT-03:00</SelectItem>
                    <SelectItem value="GMT-02:00">GMT-02:00</SelectItem>
                    <SelectItem value="GMT-01:00">GMT-01:00</SelectItem>
                    <SelectItem value="GMT+00:00">GMT+00:00</SelectItem>
                    <SelectItem value="GMT+01:00">GMT+01:00</SelectItem>
                    <SelectItem value="GMT+02:00">GMT+02:00</SelectItem>
                    <SelectItem value="GMT+03:00">GMT+03:00</SelectItem>
                    <SelectItem value="GMT+04:00">GMT+04:00</SelectItem>
                    <SelectItem value="GMT+05:00">GMT+05:00</SelectItem>
                    <SelectItem value="GMT+05:30">GMT+05:30</SelectItem>
                    <SelectItem value="GMT+06:00">GMT+06:00</SelectItem>
                    <SelectItem value="GMT+07:00">GMT+07:00</SelectItem>
                    <SelectItem value="GMT+08:00">GMT+08:00</SelectItem>
                    <SelectItem value="GMT+09:00">GMT+09:00</SelectItem>
                    <SelectItem value="GMT+10:00">GMT+10:00</SelectItem>
                    <SelectItem value="GMT+11:00">GMT+11:00</SelectItem>
                    <SelectItem value="GMT+12:00">GMT+12:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="highest_qualification">Highest Qualification</Label>
                <Input
                  id="highest_qualification"
                  name="highest_qualification"
                  value={formData.highest_qualification}
                  onChange={handleInputChange}
                  placeholder="Highest Qualification"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institute">Institute/University</Label>
                <Input
                  id="institute"
                  name="institute"
                  value={formData.institute}
                  onChange={handleInputChange}
                  placeholder="Institute/University"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Qualifications</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {QUALIFICATIONS.map((qual) => (
                    <div key={qual.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`qual-${qual.id}`}
                        checked={formData.qualifications.includes(qual.id)}
                        onCheckedChange={(checked) => handleArrayChange("qualifications", qual.id, checked)}
                      />
                      <Label htmlFor={`qual-${qual.id}`} className="text-sm font-normal">
                        {qual.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Subjects</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
                  {SUBJECTS.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subject-${subject.id}`}
                        checked={formData.subjects.includes(subject.id)}
                        onCheckedChange={(checked) => handleArrayChange("subjects", subject.id, checked)}
                      />
                      <Label htmlFor={`subject-${subject.id}`} className="text-sm font-normal">
                        {subject.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preffered_method">Preferred Method</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("preffered_method", value)}
                  value={formData.preffered_method}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="days_to_study">Days to Study</Label>
                <Input
                  id="days_to_study"
                  name="days_to_study"
                  value={formData.days_to_study}
                  onChange={handleInputChange}
                  placeholder="e.g., Monday, Wednesday, Friday"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timing_to_study">Timing to Study</Label>
                <Input
                  id="timing_to_study"
                  name="timing_to_study"
                  value={formData.timing_to_study}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 11:00 AM"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Document Uploads
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Profile Picture */}
              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile Picture</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Input
                    id="profile_picture"
                    name="profile_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profile_picture")}
                    className="hidden"
                  />
                  <label htmlFor="profile_picture" className="cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.profile_picture || "Click to upload"}</p>
                  </label>
                </div>
              </div>

              {/* CNIC or Form B Picture */}
              <div className="space-y-2">
                <Label htmlFor="cnic_or_form_b_picture">CNIC or Form B Picture</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Input
                    id="cnic_or_form_b_picture"
                    name="cnic_or_form_b_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "cnic_or_form_b_picture")}
                    className="hidden"
                  />
                  <label htmlFor="cnic_or_form_b_picture" className="cursor-pointer">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.cnic_or_form_b_picture || "Click to upload"}</p>
                  </label>
                </div>
              </div>

              {/* Degree */}
              <div className="space-y-2">
                <Label htmlFor="degree">Degree Certificate</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <Input
                    id="degree"
                    name="degree"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, "degree")}
                    className="hidden"
                  />
                  <label htmlFor="degree" className="cursor-pointer">
                    <GraduationCap className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">{fileNames.degree || "Click to upload"}</p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader text="Saving..." /> : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
