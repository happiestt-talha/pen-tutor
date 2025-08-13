"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import TutA from "@/assets/images/tutors/tut-a.webp"
import TutB from "@/assets/images/tutors/tut-b.webp"
import TutC from "@/assets/images/tutors/tut-c.webp"
import TutD from "@/assets/images/tutors/tut-d.webp"
import TutE from "@/assets/images/tutors/tut-e.webp"


const tutors = [
  {
    id: 1,
    teacherId: "TUT001",
    subject: "Mathematics",
    education: "PhD in Mathematics, MIT",
    experience: "8 years",
    image: TutA,
  },
  {
    id: 2,
    teacherId: "TUT002",
    subject: "Physics",
    education: "PhD in Physics, Stanford",
    experience: "12 years",
    image: TutB,
  },
  {
    id: 3,
    teacherId: "TUT003",
    subject: "English Literature",
    education: "MA in English, Harvard",
    experience: "6 years",
    image: TutC,
  },
  {
    id: 4,
    teacherId: "TUT004",
    subject: "Chemistry",
    education: "PhD in Chemistry, Oxford",
    experience: "10 years",
    image: TutD,
  },
  {
    id: 5,
    teacherId: "TUT005",
    subject: "Biology",
    education: "PhD in Biology, Cambridge",
    experience: "9 years",
    image: TutE,
  },
]

export default function FeaturedTutors() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 >= tutors.length - 2 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? tutors.length - 3 : prevIndex - 1))
  }

  const getVisibleTutors = () => {
    const visible = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % tutors.length
      visible.push(tutors[index])
    }
    return visible
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Featured Tutors</h2>
          <p className="text-gray-600 text-lg">Meet our top-rated tutors</p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="shrink-0 rounded-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-4 md:gap-6 items-end">
              {getVisibleTutors().map((tutor, index) => (
                <Card
                  key={tutor.id}
                  className={`transition-all duration-300 ${
                    index === 1 ? "scale-110 shadow-xl border-2 border-yellow-500" : "scale-95 shadow-md"
                  }`}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="relative mx-auto">
                      <Image
                        src={tutor.image}
                        alt={tutor.teacherId}
                        width={120}
                        height={120}
                        className="rounded-full mx-auto border-4 border-yellow-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-slate-800">{tutor.teacherId}</h3>
                      {/* <p className="text-sm text-gray-500">ID: {tutor.teacherId}</p> */}
                      <p className="font-semibold text-yellow-600">{tutor.subject}</p>
                      <p className="text-sm text-gray-600">{tutor.education}</p>
                      <p className="text-sm text-gray-600">Experience: {tutor.experience}</p>
                    </div>
                    <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" size="sm">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="shrink-0 rounded-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {tutors.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-yellow-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
