"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfileForm({ userId }) {
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        dateOfBirth: {
            day: "",
            month: "",
            year: "",
        },
        country: "",
        city: "",
        area: "",
        qualification: "",
        subjects: "",
        institute: "",
        preferredTeachingMethod: "",
        preferredDays: "",
        preferredTiming: {
            from: "",
            to: "",
        },
        documents: {
            cnic: null,
            degree: null,
        },
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [verificationStatus, setVerificationStatus] = useState({
        email: false,
        phone: false,
    })

    // Fetch profile data on component mount
    useEffect(() => {
        fetchProfileData()
    }, [userId])

    const fetchProfileData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/student/profile/${userId}`)
            if (response.ok) {
                const data = await response.json()
                setProfileData(data.profile)
                setVerificationStatus(data.verificationStatus)
            } else {
                toast.error("Failed to load profile data")
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast.error("Error loading profile")
        } finally {
            setLoading(false)
        }
    }

    const validateField = (name, value) => {
        const newErrors = { ...errors }

        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(value)) {
                    newErrors.email = "Please enter a valid email address"
                } else {
                    delete newErrors.email
                }
                break

            case "contactNumber":
                const phoneRegex = /^\+?[\d\s-()]{10,}$/
                if (!phoneRegex.test(value)) {
                    newErrors.contactNumber = "Please enter a valid contact number"
                } else {
                    delete newErrors.contactNumber
                }
                break

            case "area":
                if (value.length < 10) {
                    newErrors.area = "Please provide a detailed address (minimum 10 characters)"
                } else {
                    delete newErrors.area
                }
                break

            case "subjects":
                if (value.length < 3) {
                    newErrors.subjects = "Please enter at least one subject"
                } else {
                    delete newErrors.subjects
                }
                break

            default:
                if (!value.trim()) {
                    newErrors[name] = "This field is required"
                } else {
                    delete newErrors[name]
                }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (name, value) => {
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }))
        validateField(name, value)
    }

    const handleDateChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            dateOfBirth: {
                ...prev.dateOfBirth,
                [field]: value,
            },
        }))
    }

    const handleTimingChange = (field, value) => {
        setProfileData((prev) => ({
            ...prev,
            preferredTiming: {
                ...prev.preferredTiming,
                [field]: value,
            },
        }))
    }

    const handleFileUpload = (field, file) => {
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB")
            return
        }

        setProfileData((prev) => ({
            ...prev,
            documents: {
                ...prev.documents,
                [field]: file,
            },
        }))
    }

    const handleVerification = async (field) => {
        try {
            const response = await fetch(`/api/student/verify/${field}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    value: profileData[field === "phone" ? "contactNumber" : field],
                }),
            })

            if (response.ok) {
                toast.success(`${field} verification sent successfully`)
            } else {
                toast.error(`Failed to send ${field} verification`)
            }
        } catch (error) {
            console.error("Verification error:", error)
            toast.error("Verification failed")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        // Validate all fields
        const fieldsToValidate = [
            "email",
            "contactNumber",
            "area",
            "subjects",
            "country",
            "city",
            "qualification",
            "institute",
        ]
        let isValid = true

        fieldsToValidate.forEach((field) => {
            if (!validateField(field, profileData[field])) {
                isValid = false
            }
        })

        if (!isValid) {
            setSaving(false)
            toast.error("Please fix the errors before submitting")
            return
        }

        try {
            const formData = new FormData()

            // Add profile data
            Object.keys(profileData).forEach((key) => {
                if (key === "documents") {
                    Object.keys(profileData.documents).forEach((docKey) => {
                        if (profileData.documents[docKey]) {
                            formData.append(docKey, profileData.documents[docKey])
                        }
                    })
                } else if (key === "dateOfBirth" || key === "preferredTiming") {
                    formData.append(key, JSON.stringify(profileData[key]))
                } else {
                    formData.append(key, profileData[key])
                }
            })

            const response = await fetch(`/api/student/profile/${userId}`, {
                method: "PUT",
                body: formData,
            })

            if (response.ok) {
                toast.success("Profile updated successfully")
                fetchProfileData() // Refresh data
            } else {
                const errorData = await response.json()
                toast.error(errorData.message || "Failed to update profile")
            }
        } catch (error) {
            console.error("Submit error:", error)
            toast.error("Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name - Non-editable */}
                        <div>
                            <Label htmlFor="name">Your Name</Label>
                            <Input id="name" value={profileData.name} disabled className="bg-gray-50 cursor-not-allowed" />
                        </div>

                        {/* Email with verification */}
                        <div>
                            <Label htmlFor="email">E-mail Address</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleVerification("email")}
                                    className="bg-green-500 hover:bg-green-600 px-4"
                                    disabled={verificationStatus.email}
                                >
                                    {verificationStatus.email ? <Check className="h-4 w-4" /> : "Verify"}
                                </Button>
                            </div>
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Contact Number with verification */}
                        <div>
                            <Label htmlFor="contactNumber">Contact Number</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="contactNumber"
                                    value={profileData.contactNumber}
                                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                                    className={errors.contactNumber ? "border-red-500" : ""}
                                />
                                <Button
                                    type="button"
                                    onClick={() => handleVerification("phone")}
                                    className="bg-green-500 hover:bg-green-600 px-4"
                                    disabled={verificationStatus.phone}
                                >
                                    {verificationStatus.phone ? <Check className="h-4 w-4" /> : "Verify"}
                                </Button>
                            </div>
                            {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <Label>Date Of Birth</Label>
                            <div className="flex gap-2">
                                <Select value={profileData.dateOfBirth.day} onValueChange={(value) => handleDateChange("day", value)}>
                                    <SelectTrigger className="w-20">
                                        <SelectValue placeholder="Day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <SelectItem key={i + 1} value={String(i + 1)}>
                                                {i + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={profileData.dateOfBirth.month}
                                    onValueChange={(value) => handleDateChange("month", value)}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December",
                                        ].map((month, index) => (
                                            <SelectItem key={month} value={String(index + 1)}>
                                                {month}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={profileData.dateOfBirth.year} onValueChange={(value) => handleDateChange("year", value)}>
                                    <SelectTrigger className="w-24">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 50 }, (_, i) => {
                                            const year = new Date().getFullYear() - i
                                            return (
                                                <SelectItem key={year} value={String(year)}>
                                                    {year}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="country">Add Country</Label>
                            <Input
                                id="country"
                                value={profileData.country}
                                onChange={(e) => handleInputChange("country", e.target.value)}
                                className={errors.country ? "border-red-500" : ""}
                            />
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>

                        <div>
                            <Label htmlFor="city">Add City</Label>
                            <Input
                                id="city"
                                value={profileData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                className={errors.city ? "border-red-500" : ""}
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="area">Add Area</Label>
                        <Textarea
                            id="area"
                            value={profileData.area}
                            onChange={(e) => handleInputChange("area", e.target.value)}
                            className={errors.area ? "border-red-500" : ""}
                            placeholder="Enter detailed address"
                        />
                        {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Education Information */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="qualification">Add Your Qualification</Label>
                            <Input
                                id="qualification"
                                value={profileData.qualification}
                                onChange={(e) => handleInputChange("qualification", e.target.value)}
                                className={errors.qualification ? "border-red-500" : ""}
                            />
                            {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
                        </div>

                        <div>
                            <Label htmlFor="subjects">Add Your Subjects</Label>
                            <Input
                                id="subjects"
                                value={profileData.subjects}
                                onChange={(e) => handleInputChange("subjects", e.target.value)}
                                className={errors.subjects ? "border-red-500" : ""}
                                placeholder="e.g., English, Physics, Maths, Computer"
                            />
                            {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="institute">Add Your Institute</Label>
                        <Input
                            id="institute"
                            value={profileData.institute}
                            onChange={(e) => handleInputChange("institute", e.target.value)}
                            className={errors.institute ? "border-red-500" : ""}
                        />
                        {errors.institute && <p className="text-red-500 text-sm mt-1">{errors.institute}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="teachingMethod">Preferred Method Of Teaching</Label>
                            <Select
                                value={profileData.preferredTeachingMethod}
                                onValueChange={(value) => handleInputChange("preferredTeachingMethod", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="online">Online</SelectItem>
                                    <SelectItem value="offline">Offline</SelectItem>
                                    <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="preferredDays">Preferred Days Of Study</Label>
                            <Select
                                value={profileData.preferredDays}
                                onValueChange={(value) => handleInputChange("preferredDays", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select days" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2 Days Selected</SelectItem>
                                    <SelectItem value="3">3 Days Selected</SelectItem>
                                    <SelectItem value="4">4 Days Selected</SelectItem>
                                    <SelectItem value="5">5 Days Selected</SelectItem>
                                    <SelectItem value="6">6 Days Selected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label>Preferred Timing Of Study</Label>
                        <div className="flex items-center gap-4">
                            <Input
                                type="time"
                                value={profileData.preferredTiming.from}
                                onChange={(e) => handleTimingChange("from", e.target.value)}
                                className="w-32"
                            />
                            <span>To</span>
                            <Input
                                type="time"
                                value={profileData.preferredTiming.to}
                                onChange={(e) => handleTimingChange("to", e.target.value)}
                                className="w-32"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Documents */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <Label>Add CNIC / B-Form</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload("cnic", e.target.files[0])}
                                className="hidden"
                                id="cnic-upload"
                            />
                            <label htmlFor="cnic-upload" className="cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                    {profileData.documents.cnic ? profileData.documents.cnic.name : "Click to upload CNIC/B-Form"}
                                </p>
                            </label>
                        </div>
                    </div>

                    <div>
                        <Label>Add Degree Picture</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload("degree", e.target.files[0])}
                                className="hidden"
                                id="degree-upload"
                            />
                            <label htmlFor="degree-upload" className="cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                    {profileData.documents.degree ? profileData.documents.degree.name : "Click to upload degree picture"}
                                </p>
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-start">
                <Button type="submit" disabled={saving} className="bg-green-500 hover:bg-green-600 px-8 py-2">
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </form>
    )
}
