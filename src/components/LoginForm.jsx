"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export default function LoginForm() {
  const [activeTab, setActiveTab] = useState("students")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="p-8 lg:p-12">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PT</span>
                  </div>
                  <span className="text-xl font-bold text-gray-800">PEN TUTOR</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Register</h2>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger
                    value="students"
                    className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                  >
                    Students
                  </TabsTrigger>
                  <TabsTrigger value="tutor" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    Tutor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="students" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input placeholder="Enter your full name" className="w-full" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <Input type="email" placeholder="Enter your email address" className="w-full" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input type="tel" placeholder="Enter your phone number" className="w-full" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <Input type="date" className="w-full" />
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-12 h-12 p-0">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tutor" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input placeholder="Enter your full name" className="w-full" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <Input type="email" placeholder="Enter your email address" className="w-full" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input type="tel" placeholder="Enter your phone number" className="w-full" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Experience</label>
                      <Input placeholder="Years of experience" className="w-full" />
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Side - Image */}
            <div
              className={`relative overflow-hidden ${
                activeTab === "students"
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                  : "bg-gradient-to-br from-blue-500 to-blue-700"
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=350&text=Students+with+Books"
                  alt="Students with colorful books"
                  width={350}
                  height={400}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
