"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Video, VideoOff, Mic, MicOff, Phone, Users, MessageSquare, Share, Settings } from "lucide-react"

export default function VideoCallPage({ params }) {
  const [sessionId] = useState(params.sessionId)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)
  const [participants, setParticipants] = useState([])

  useEffect(() => {
    // Initialize video call
    console.log("Initializing video call for session:", sessionId)

    // Mock participants
    setParticipants([
      { id: "tutor", name: "Maryam Safdar", role: "tutor", video: true, audio: true },
      { id: "student", name: "Muhammad Ahmad", role: "student", video: true, audio: true },
    ])

    setIsCallActive(true)
  }, [sessionId])

  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleAudio = () => setIsAudioOn(!isAudioOn)
  const endCall = () => {
    setIsCallActive(false)
    window.close()
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Session: {sessionId}</h1>
          <p className="text-sm text-gray-300">Chemistry - O Level</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="text-sm">{participants.length} participants</span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {participants.map((participant) => (
            <Card key={participant.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-0 h-full">
                <div className="relative h-full bg-gray-700 rounded-lg overflow-hidden">
                  {participant.video ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-6xl">{participant.name.charAt(0)}</div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                      <VideoOff className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Participant Info */}
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{participant.name}</span>
                      {!participant.audio && <MicOff className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant={isAudioOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          <Button
            variant={isVideoOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button variant="destructive" size="lg" onClick={endCall} className="rounded-full w-12 h-12 p-0">
            <Phone className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <Share className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
