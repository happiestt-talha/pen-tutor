"use client"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Calendar, DollarSign, Bell } from 'lucide-react'
import ScheduledClasses from "@/components/tutor/ScheduledClasses"
import PendingClasses from "@/components/tutor/PendingClasses"
import { useAuth } from '@/components/auth/AuthContext';
import Loader from "@/components/shared/Loader"

function TutorDashboard() {
  const { user, profileData, fetchProfile } = useAuth();

  if (!user || !profileData) {
    return <Loader text="Loading Dashboard..." isFullScreen={true} />
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Manage your tuitions and schedule.</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>
              {user.name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PendingClasses onClassAccepted={fetchProfile} />
          <ScheduledClasses />
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Summary</CardTitle>
              <CardDescription>A quick look at your professional details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Experience</span>
                <span className="text-sm text-gray-600">{profileData?.experience_years || 0} years</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Hourly Rate</span>
                <span className="text-sm font-bold text-green-600">${profileData?.hourly_rate || 0}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Subjects</span>
                <div className="flex flex-wrap gap-2">
                  {profileData?.teaching_subjects?.map(s => <Badge key={s} variant="secondary">{s}</Badge>) || <p className="text-sm text-gray-500">Not specified</p>}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => window.location.href = "/profile"}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-blue-800">5</div>
                  <div className="text-sm text-gray-600">Classes This Week</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-green-800">{profileData?.teaching_subjects?.length || 0}</div>
                  <div className="text-sm text-gray-600">Subjects Taught</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function TutorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['tutor']}>
      <TutorDashboard />
    </ProtectedRoute>
  );
}
