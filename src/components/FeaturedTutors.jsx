"use client"

import { useState, useEffect, useCallback } from "react"
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

export default function EnhancedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const getCardsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1 // mobile: 1 card
      if (window.innerWidth < 1024) return 2 // tablet: 2 cards
      return 3 // desktop: 3 cards
    }
    return 3
  }

  const [cardsPerView, setCardsPerView] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView())
    }

    handleResize() // Set initial value
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = tutors.length - cardsPerView
      return prevIndex >= maxIndex ? 0 : prevIndex + 1
    })
  }, [cardsPerView])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = tutors.length - cardsPerView
      return prevIndex === 0 ? maxIndex : prevIndex - 1
    })
  }, [cardsPerView])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, 4000) // 4 second intervals

    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  const getVisibleTutors = () => {
    const visible = []
    for (let i = 0; i < cardsPerView; i++) {
      const index = (currentIndex + i) % tutors.length
      visible.push(tutors[index])
    }
    return visible
  }

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">Featured Tutors</h2>
          <p className="text-gray-600 text-lg">Meet our top-rated tutors</p>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div
            className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="shrink-0 rounded-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white bg-transparent transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1 max-w-5xl">
              {getVisibleTutors().map((tutor, index) => (
                <Card
                  key={`${tutor.id}-${currentIndex}`}
                  className={`transition-all duration-500 hover:shadow-xl ${
                    cardsPerView === 1 || (cardsPerView === 3 && index === 1)
                      ? "scale-105 shadow-xl border-2 border-yellow-500"
                      : "hover:scale-105 shadow-md"
                  }`}
                >
                  <CardContent className="p-4 sm:p-6 text-center space-y-4">
                    <div className="relative mx-auto">
                      <Image
                        src={tutor.image || "/placeholder.svg"}
                        alt={tutor.teacherId}
                        width={120}
                        height={120}
                        className="rounded-full mx-auto border-4 border-yellow-200 transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-slate-800">{tutor.teacherId}</h3>
                      <p className="font-semibold text-yellow-600">{tutor.subject}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{tutor.education}</p>
                      <p className="text-sm text-gray-600">Experience: {tutor.experience}</p>
                    </div>
                    <Button
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white transition-colors duration-200"
                      size="sm"
                    >
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
              className="shrink-0 rounded-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white bg-transparent transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(tutors.length / cardsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * cardsPerView)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / cardsPerView) === index
                    ? "bg-yellow-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {!isPaused && (
            <div className="mt-4 max-w-xs mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-yellow-500 h-1 rounded-full transition-all duration-100 animate-pulse"
                  style={{
                    animation: "progress 4s linear infinite",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  )
}
