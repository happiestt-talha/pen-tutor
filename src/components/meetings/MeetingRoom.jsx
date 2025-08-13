"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, VideoIcon, VideoOff, Mic, MicOff, Monitor, MonitorOff, Phone, Send, Users, AlertCircle, Settings } from 'lucide-react'
import { toast } from "sonner"
import { useAuth } from '@/components/auth/AuthContext'

/**
 * MeetingRoom Component - WebRTC Video Calling Interface
 * Uses exact API routes as specified in the backend documentation
 * 
 * API Routes Used:
 * - GET /api/meetings/<meeting_id>/participants/ — List current participants
 * - POST /api/meetings/end/<meeting_id>/ — End class (tutor only)
 */
export default function MeetingRoom({ meetingId }) {
  const { user, token } = useAuth()
  const router = useRouter()
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const webSocketRef = useRef(null)

  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState("good")

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const WS_URL = `ws://localhost:8000/ws/meetings/${meetingId}/?token=${token}`

  const setupWebSocket = useCallback(() => {
    webSocketRef.current = new WebSocket(WS_URL)

    webSocketRef.current.onopen = () => {
      toast.success("Connected to meeting server.")
      webSocketRef.current.send(JSON.stringify({ type: 'join' }))
    }

    webSocketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      const pc = peerConnectionRef.current

      switch (data.type) {
        case 'offer':
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
            const answer = await pc.createAnswer()
            await pc.setLocalDescription(answer)
            webSocketRef.current.send(JSON.stringify({ type: 'answer', answer: pc.localDescription }))
          }
          break
        case 'answer':
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
          }
          break
        case 'candidate':
          if (pc && data.candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
          }
          break
        case 'user_joined':
          toast.info('Another user joined the meeting.')
          // Create offer if this is the initiating peer
          if (data.is_initiator) {
            const offer = await peerConnectionRef.current.createOffer();
            await peerConnectionRef.current.setLocalDescription(offer);
            webSocketRef.current.send(JSON.stringify({ type: 'offer', offer: peerConnectionRef.current.localDescription }));
          }
          break;
        case 'user_left':
          toast.info('A user left the meeting.')
          // Reset remote video
          if(remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
          // Optionally, re-initialize connection for a new user
          initializePeerConnection();
          break;
        default:
          break
      }
    }

    webSocketRef.current.onclose = () => toast.warn("Disconnected from meeting server.")
    webSocketRef.current.onerror = (err) => toast.error("WebSocket error.")
  }, [WS_URL])

  const initializePeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        webSocketRef.current.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }))
      }
    }

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current)
      })
    }

    peerConnectionRef.current = pc
  }, [])

  const startMedia = useCallback(async (screen = false) => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }

      const stream = screen
        ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        : await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      setIsScreenSharing(screen)
      
      // Re-initialize peer connection with new stream
      initializePeerConnection()

    } catch (error) {
      toast.error("Could not access camera/microphone.")
      console.error("Error accessing media devices.", error)
    }
  }, [initializePeerConnection])

  useEffect(() => {
    if (token) {
      startMedia()
      setupWebSocket()
    }
    return () => {
      if (webSocketRef.current) webSocketRef.current.close()
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop())
      if (peerConnectionRef.current) peerConnectionRef.current.close()
    }
  }, [token, startMedia, setupWebSocket])

  const toggleAudio = () => {
    localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled)
    setIsAudioMuted(prev => !prev)
  }

  const toggleVideo = () => {
    localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled)
    setIsVideoOff(prev => !prev)
  }

  const toggleScreenShare = () => {
    startMedia(!isScreenSharing)
  }

  const handleLeave = () => {
    router.push(user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Joining Meeting</h2>
            <p className="text-gray-600">Please wait while we set up your video call...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Meeting Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">PenTutor Meeting</h1>
          <Badge variant="outline" className="text-white border-white">
            {participants.length} participants
          </Badge>
          <Badge 
            className={`${
              connectionQuality === 'good' ? 'bg-green-500' :
              connectionQuality === 'fair' ? 'bg-yellow-500' :
              connectionQuality === 'poor' ? 'bg-red-500' : 'bg-gray-500'
            }`}
          >
            {connectionQuality} connection
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChat(!showChat)}
          >
            💬 Chat
          </Button>
          
          {user.role === "tutor" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                webSocketRef.current.send(JSON.stringify({ type: 'end_meeting' }))
                handleLeave()
              }}
            >
              End Meeting
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLeave}
          >
            Leave
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Area */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Local Video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded">
                You {isScreenSharing && "(Screen)"}
              </div>
            </div>

            {/* Remote Videos */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded">
                Remote Participant
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              variant={isVideoOff ? "default" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full w-12 h-12 p-0"
            >
              {isVideoOff ? <VideoIcon className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>

            <Button
              variant={isAudioMuted ? "default" : "destructive"}
              size="lg"
              onClick={toggleAudio}
              className="rounded-full w-12 h-12 p-0"
            >
              {isAudioMuted ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>

            <Button
              variant={isScreenSharing ? "secondary" : "outline"}
              size="lg"
              onClick={toggleScreenShare}
              className="rounded-full w-12 h-12 p-0"
            >
              {isScreenSharing ? <MonitorOff className="h-6 w-6" /> : <Monitor className="h-6 w-6" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={handleLeave}
              className="rounded-full w-12 h-12 p-0"
            >
              <Phone className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Chat</h3>
            </div>
            
            <div 
              className="flex-1 p-4 overflow-y-auto space-y-2"
            >
              {chatMessages.map(message => (
                <div key={message.id} className="bg-gray-700 p-2 rounded">
                  <div className="text-sm font-medium">{message.sender}</div>
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs text-gray-400">{message.timestamp}</div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && webSocketRef.current.send(JSON.stringify({ type: 'chat_message', message: newMessage }))}
                  className="bg-gray-700 border-gray-600"
                />
                <Button onClick={() => {
                  webSocketRef.current.send(JSON.stringify({ type: 'chat_message', message: newMessage }))
                  setNewMessage("")
                }} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
