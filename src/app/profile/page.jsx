"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentRegistrationForm from "@/components/profile/StudentRegistrationForm";
import TutorRegistrationForm from "@/components/profile/TutorRegistrationForm";
import { Suspense } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  
  // Determine default tab based on user type or query param
  const defaultTab = searchParams.get('form') || user?.userType || 'student';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Complete Your Profile
        </h1>
        <p className="text-gray-500">
          Provide your details to get full access to the PenTutor platform.
        </p>
      </div>
      <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => router.push(`/profile?form=${value}`)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Register as Student</TabsTrigger>
          <TabsTrigger value="tutor">Register as Tutor</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <StudentRegistrationForm />
        </TabsContent>
        <TabsContent value="tutor">
          <TutorRegistrationForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ProfilePage() {
  return (
    // Suspense is required for useSearchParams
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
