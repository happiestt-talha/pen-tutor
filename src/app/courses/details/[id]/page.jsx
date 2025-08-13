"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Play, Clock, Users, Star, BookOpen, Video, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Sidebar } from "@/components/ui/sidebar"
import { toast } from "sonner"



export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)

  // Mock course detail data
  const mockCourseDetail = {
    id: courseId,
    title: "Advanced Mathematics",
    description: "Comprehensive course covering calculus, algebra, and statistics",
    longDescription:
      "This comprehensive mathematics course is designed to provide students with a deep understanding of advanced mathematical concepts. We cover calculus, linear algebra, statistics, and their real-world applications. The course includes interactive lessons, practical exercises, and live Q&A sessions with experienced instructors.",
    price: "$99",
    courseType: "paid",
    isActive: true,
    hasLiveClasses: true,
    subject: "Mathematics",
    instructor: {
      name: "Dr. Sarah Johnson",
      avatar: "/teacher-avatar.png",
      bio: "Dr. Sarah Johnson is a renowned mathematician with over 15 years of teaching experience. She holds a PhD in Applied Mathematics from MIT and has published numerous research papers in top-tier journals.",
      rating: 4.9,
      totalStudents: 2450,
    },
    students: 245,
    rating: 4.8,
    duration: "12 weeks",
    thumbnail: "/math-course.png",
    totalLessons: 48,
    totalVideos: 36,
    totalQuizzes: 12,
    curriculum: [
      {
        id: "1",
        title: "Introduction to Calculus",
        lessons: [
          { id: "1-1", title: "Limits and Continuity", duration: "25 min", type: "video", isCompleted: false },
          { id: "1-2", title: "Derivatives Basics", duration: "30 min", type: "video", isCompleted: false },
          { id: "1-3", title: "Practice Quiz", duration: "15 min", type: "quiz", isCompleted: false },
        ],
      },
      {
        id: "2",
        title: "Advanced Derivatives",
        lessons: [
          { id: "2-1", title: "Chain Rule", duration: "28 min", type: "video", isCompleted: false },
          { id: "2-2", title: "Implicit Differentiation", duration: "32 min", type: "video", isCompleted: false },
          { id: "2-3", title: "Applications Assignment", duration: "45 min", type: "assignment", isCompleted: false },
        ],
      },
      {
        id: "3",
        title: "Integration Techniques",
        lessons: [
          { id: "3-1", title: "Basic Integration", duration: "35 min", type: "video", isCompleted: false },
          { id: "3-2", title: "Integration by Parts", duration: "40 min", type: "video", isCompleted: false },
          { id: "3-3", title: "Integration Quiz", duration: "20 min", type: "quiz", isCompleted: false },
        ],
      },
    ],
    reviews: [
      {
        id: "1",
        studentName: "Alex Chen",
        avatar: "/student-1.png",
        rating: 5,
        comment: "Excellent course! Dr. Johnson explains complex concepts in a very clear and understandable way.",
        date: "2024-01-15",
      },
      {
        id: "2",
        studentName: "Maria Rodriguez",
        avatar: "/student-2.png",
        rating: 4,
        comment: "Great content and structure. The live classes are particularly helpful for clarifying doubts.",
        date: "2024-01-10",
      },
      {
        id: "3",
        studentName: "John Smith",
        avatar: "/student-3.png",
        rating: 5,
        comment:
          "This course helped me understand calculus concepts that I struggled with for years. Highly recommended!",
        date: "2024-01-08",
      },
    ],
    prerequisites: [
      "Basic algebra knowledge",
      "Understanding of functions and graphs",
      "High school mathematics completion",
    ],
    learningOutcomes: [
      "Master fundamental calculus concepts including limits, derivatives, and integrals",
      "Apply mathematical concepts to solve real-world problems",
      "Develop strong analytical and problem-solving skills",
      "Prepare for advanced mathematics courses",
      "Gain confidence in mathematical reasoning and proof techniques",
    ],
  }

  const fetchCourseDetail = async () => {
    try {
      setLoading(true)

      // For now, using mock data. Replace with actual API call:
      // const response = await axios.get(`/api/courses/${courseId}/`);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCourse(mockCourseDetail)
    } catch (error) {
      console.error("Error fetching course detail:", error)
      toast.error("Failed to load course details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail()
    }
  }, [courseId])

  const handleEnroll = async () => {
    try {
      // Replace with actual enrollment API call
      // await axios.post(`/api/courses/${courseId}/enroll/`);

      setIsEnrolled(true)
      toast.success("Successfully enrolled in the course!")
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast.error("Failed to enroll in course")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Sidebar /> */}
        <div className="lg:ml-64 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <Sidebar /> */}
        <div className="lg:ml-64 p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
            <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Sidebar /> */}

      <div className="lg:ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-[#313D6A] hover:text-[#F5BB07]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>

        {/* Course Hero Section */}
        <div className="bg-gradient-to-r from-[#313D6A] to-[#313D6A]/80 text-white px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-[#F5BB07] text-white">{course.subject}</Badge>
                  {course.hasLiveClasses && <Badge className="bg-red-500 text-white">Live Classes</Badge>}
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{course.title}</h1>

                <p className="text-lg text-gray-200 mb-6">{course.description}</p>

                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>
                      {course.rating} ({course.students} students)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>{course.totalVideos} videos</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Play className="h-6 w-6 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Course Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#313D6A]">Course Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{course.longDescription}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">What You'll Learn</h3>
                        <ul className="space-y-2">
                          {course.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-600">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Prerequisites</h3>
                        <ul className="space-y-1">
                          {course.prerequisites.map((prerequisite, index) => (
                            <li key={index} className="text-gray-600">
                              • {prerequisite}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#313D6A]">Course Curriculum</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {course.curriculum.map((section, sectionIndex) => (
                          <div key={section.id} className="border rounded-lg p-4">
                            <h3 className="font-semibold text-[#313D6A] mb-3">
                              Section {sectionIndex + 1}: {section.title}
                            </h3>
                            <div className="space-y-2">
                              {section.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                >
                                  <div className="flex items-center gap-3">
                                    {lesson.type === "video" && <Video className="h-4 w-4 text-blue-500" />}
                                    {lesson.type === "quiz" && <BookOpen className="h-4 w-4 text-green-500" />}
                                    {lesson.type === "assignment" && <Calendar className="h-4 w-4 text-orange-500" />}
                                    <span className="text-sm">{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="instructor" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#313D6A]">Meet Your Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-6">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            src={course.instructor.avatar || "/placeholder.svg"}
                            alt={course.instructor.name}
                          />
                          <AvatarFallback>
                            {course.instructor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[#313D6A] mb-2">{course.instructor.name}</h3>

                          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span>{course.instructor.rating} rating</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{course.instructor.totalStudents.toLocaleString()} students</span>
                            </div>
                          </div>

                          <p className="text-gray-600">{course.instructor.bio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#313D6A]">Student Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {course.reviews.map((review) => (
                          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.studentName} />
                                <AvatarFallback>
                                  {review.studentName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{review.studentName}</h4>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>

                                <div className="flex items-center gap-1 mb-2">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>

                                <p className="text-gray-600">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-[#313D6A] mb-2">
                      {course.courseType === "free" ? "Free" : course.price}
                    </div>
                    {course.courseType === "paid" && <p className="text-sm text-gray-600">One-time payment</p>}
                  </div>

                  <Button
                    className="w-full mb-4 bg-[#F5BB07] hover:bg-[#F5BB07]/90 text-white"
                    size="lg"
                    onClick={handleEnroll}
                    disabled={isEnrolled}
                  >
                    {isEnrolled ? "Enrolled" : "Enroll Now"}
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Lessons</span>
                      <span className="font-medium">{course.totalLessons}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Videos</span>
                      <span className="font-medium">{course.totalVideos}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Quizzes</span>
                      <span className="font-medium">{course.totalQuizzes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Students</span>
                      <span className="font-medium">{course.students}</span>
                    </div>
                  </div>

                  {course.hasLiveClasses && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 text-red-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Live Classes Included</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
