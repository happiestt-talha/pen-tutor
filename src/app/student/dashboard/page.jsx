"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Users, TrendingUp, Bell, Plus } from 'lucide-react'
import StudentClassesList from "@/components/student/StudentClassesList"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useAuth } from '@/components/auth/AuthContext';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Loader from "@/components/shared/Loader";

function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  console.log("User Data in StudentDashboard: ", user);
  const router = useRouter()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const getStudentProfile = async () => {
    const access = localStorage.getItem('access_token');
    console.log("Access Token: ", access);
    try {
      const response = await axios.get(`${API_BASE}/api/auth/profile/`,
        {
          headers: {
            Authorization: `Bearer ${access}`
          }
        }
      );
      console.log("User Profile: ", response.data);
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  useEffect(() => {
    getStudentProfile();
  }, []);

  if (!user) {
    return <Loader text="Loading Dashboard..." isFullScreen={true} />
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Here's an overview of your learning journey.</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+2 since yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5</div>
            <p className="text-xs text-muted-foreground">Total learning time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tutors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Ready to help</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-6">
        <Button onClick={() => router.push('/student/create-class')}>
          <Plus className="h-4 w-4 mr-2" />
          Request New Tuition
        </Button>
      </div>

      <StudentClassesList />
    </div>
  )
}

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <StudentDashboard />
    </ProtectedRoute>
  )
}
