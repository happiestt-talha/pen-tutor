import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { FaArrowRightLong } from "react-icons/fa6"
import FeaturedTutors from "@/components/FeaturedTutors"
import Footer from "@/components/Footer"

import stdBags from "@/assets/images/student_with_bags.png"
import lady from "@/assets/images/lady.png"
import classroom from "@/assets/images/classroom.jpg"
import studentSmiling from "@/assets/images/std.png"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-yellow-100 to-yellow-200 overflow-hidden">
        <div className="container mx-auto px-4 pt-12 lg:pt-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">Welcome To Pen Tutor</h1>
              <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg inline-block">
                <span className="font-semibold">Student Query Form</span>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
              <div className="absolute h-[200px] w-[200px] lg:h-[250px] lg:w-[250px] bg-yellow-400 rounded-full opacity-50 -top-8 lg:-top-12"></div>
              <Image
                src={stdBags}
                alt="Students with backpacks"
                width={300}
                height={300}
                className="relative z-10 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Query Form Section */}
      <section className="bg-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="space-y-4">
              <label className="text-white font-medium block">Name</label>
              <Input placeholder="Enter your name" className="bg-white" />
              <Input placeholder="Enter your email" className="bg-white" />
            </div>
            <div className="space-y-4">
              <label className="text-white font-medium block">Departments</label>
              <Input placeholder="Select department" className="bg-white" />
              <Input placeholder="Select subject" className="bg-white" />
            </div>
            <div className="space-y-4">
              <label className="text-white font-medium block">Tuition</label>
              <Input placeholder="Select tuition type" className="bg-white" />
              <Input placeholder="Verify information" className="bg-white" />
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
              <span className="text-gray-900 font-bold">
                <FaArrowRightLong />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div className="relative flex justify-center items-end min-h-[300px] order-2 lg:order-1">
              <div className="absolute h-[200px] w-[200px] lg:h-[250px] lg:w-[250px] bg-yellow-400 rounded-2xl transform rotate-3"></div>
              <div className="absolute h-[200px] w-[200px] lg:h-[250px] lg:w-[250px] bg-yellow-500 rounded-2xl transform -rotate-3"></div>
              <Image
                src={studentSmiling}
                alt="Female student with tablet"
                width={250}
                height={300}
                className="relative z-10 object-contain"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-yellow-500">For Students</h2>
              <p className="text-gray-600 text-lg">Search Thousands Of Tutors</p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Find A Tutor In Your Area</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Contact & Arrange Lessons With Tutor</span>
                </li>
              </ul>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg">Read More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Tutors Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800">For Tutors</h2>
              <p className="text-gray-600 text-lg">Search Thousands Of Tutors</p>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                  <span className="text-gray-700">Find A Tutor In Your Area</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                  <span className="text-gray-700">Contact & Arrange Lessons With Tutor</span>
                </li>
              </ul>
              <Button className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg">Read More</Button>
            </div>
            <div className="relative flex justify-center items-end min-h-[300px]">
              <div className="absolute h-[200px] w-[200px] lg:h-[250px] lg:w-[250px] bg-slate-800 rounded-2xl"></div>
              <Image
                src={lady}
                alt="Professional female tutor"
                width={250}
                height={300}
                className="relative z-10 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      <FeaturedTutors />

      {/* Why Choose Pen Tutor Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-slate-800 max-w-6xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Why Choose Pen Tutor</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat lacinia risus porta est.
                    Ornare orci vitae, sit pharetra sed. Sollicitudin nunc, libero et varius maximus blandit. Velit
                    amet, aliquet suscipit amet, libero commodo.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Conceptual Study Environment",
                      "Expert Tutors",
                      "Affordable Pricing",
                      "Flexible Schedules",
                      "Safe Learning Environment",
                      "Regular Updates",
                      "24/7 Support",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-center items-center">
                  <Image
                    src={classroom}
                    alt="Tutoring session"
                    width={300}
                    height={250}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
