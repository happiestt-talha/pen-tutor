"use client"

import { useParams } from "next/navigation"
import { use, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, VideoOff, Mic, MicOff, Phone, Users, MessageSquare, Settings, Monitor, MonitorOff, Loader2, AlertCircle } from 'lucide-react'
import { toast } from "sonner"
import { useAuth } from "@/components/auth/AuthContext"

/**
 * Meeting Room Page - WebRTC Video Call Interface
 * Route: /meetings/[meeting_id]/room
 * 
 * This page renders the MeetingRoom component with the meeting ID from the URL
 */
export default function MeetingRoomPage() {
  const params = useParams()
  const meetingId = params.meeting_id

  if (!meetingId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Meeting</h1>
          <p>Meeting ID not found in URL</p>
        </div>
      </div>
    )
  }

  return <MeetingRoom meetingId={meetingId} />
}

/**
 * MeetingRoom Component - WebRTC Video Conferencing Interface
 * 
 * Handles real-time video/audio communication between tutor and student
 * Uses exact API routes as specified in the backend documentation
 * 
 * API Routes Used:
 * - GET /api/meetings/<meeting_id>/participants/ — List current participants
 * - POST /api/meetings/end/<meeting_id>/ — End class (tutor only)
 */
function MeetingRoom({ meetingId }) {
  const router = useRouter()
  const { user, logout } = useAuth()

  // Meeting state management
  const [meetingData, setMeetingData] = useState(null)
  const [participants, setParticipants] = useState([])
  const [connectionStatus, setConnectionStatus] = useState("connecting") // connecting, connected, failed
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Media control states
  const [localVideo, setLocalVideo] = useState(true)
  const [localAudio, setLocalAudio] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  // Chat functionality
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  // WebRTC refs
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const socketRef = useRef(null)

  // Meeting duration tracking
  const [meetingDuration, setMeetingDuration] = useState(0)
  const startTimeRef = useRef(null)
  
  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  /**
   * Initialize meeting on component mount
   */
  useEffect(() => {
    if (meetingId && user) {
      console.log(`🎥 MeetingRoom: Initializing meeting ${meetingId} for user ${user.user_type}`)
      initializeMeeting()
    } else if (!user) {
      console.log("❌ MeetingRoom: No user found, redirecting to auth")
      router.push("/auth")
    }

    return () => {
      console.log("🧹 MeetingRoom: Cleaning up meeting resources")
      cleanup()
    }
  }, [meetingId, user])

  /**
   * Update meeting duration every second
   */
  useEffect(() => {
    let durationInterval
    if (connectionStatus === "connected" && startTimeRef.current) {
      durationInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
        setMeetingDuration(elapsed)
      }, 1000)
    }

    return () => {
      if (durationInterval) {
        clearInterval(durationInterval)
      }
    }
  }, [connectionStatus])

  /**
   * Main function to initialize the meeting
   * Handles API calls, WebRTC setup, and media initialization
   */
  const initializeMeeting = async () => {
    try {
      console.log(`📡 MeetingRoom: Fetching participants for meeting ${meetingId}`)
      setConnectionStatus("connecting")

      // Get authentication token
      const token = localStorage.getItem("access_token")
      if (!token) {
        console.error("❌ MeetingRoom: No access token found")
        throw new Error("Authentication required")
      }

      // Fetch meeting participants using GET /api/meetings/<meeting_id>/participants/
      const response = await fetch(`${API_BASE}/api/meetings/${meetingId}/participants/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("📥 MeetingRoom: Participants response status:", response.status)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Meeting not found or has ended")
        } else if (response.status === 403) {
          throw new Error("You don't have permission to join this meeting")
        } else if (response.status === 410) {
          throw new Error("This meeting has expired")
        }
        throw new Error(`Failed to load meeting: ${response.status}`)
      }

      const data = await response.json()
      console.log("✅ MeetingRoom: Meeting data loaded:", data)
      
      setMeetingData(data.meeting || data)
      setParticipants(data.participants || [])
      startTimeRef.current = Date.now()

      // Initialize media devices
      await initializeMedia()

      // Set up WebRTC connection
      await setupWebRTC()

      // Connect to signaling server (WebSocket)
      setupSignaling()

      setConnectionStatus("connected")
      setLoading(false)
      toast.success("Connected to meeting!")

    } catch (error) {
      console.error("❌ MeetingRoom: Failed to initialize meeting:", error)
      setError(error.message)
      setConnectionStatus("failed")
      setLoading(false)
      toast.error(error.message)
    }
  }

  /**
   * Initialize media devices (camera and microphone)
   * Requests user permissions and sets up local video stream
   */
  const initializeMedia = async () => {
    try {
      console.log("🎤 MeetingRoom: Requesting media permissions...")
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      console.log("✅ MeetingRoom: Media stream obtained:", stream.getTracks().map(t => t.kind))
      
      localStreamRef.current = stream

      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        console.log("📹 MeetingRoom: Local video stream attached")
      }

      // Set initial media states based on stream
      const videoTrack = stream.getVideoTracks()[0]
      const audioTrack = stream.getAudioTracks()[0]
      
      setLocalVideo(videoTrack?.enabled || false)
      setLocalAudio(audioTrack?.enabled || false)

    } catch (error) {
      console.error("❌ MeetingRoom: Failed to access media devices:", error)
      toast.error("Failed to access camera/microphone. Please check permissions.")
      
      // Continue without media
      setLocalVideo(false)
      setLocalAudio(false)
    }
  }

  /**
   * Set up WebRTC peer connection
   * Configures ICE servers and connection handlers
   */
  const setupWebRTC = async () => {
    try {
      console.log("🌐 MeetingRoom: Setting up WebRTC connection...")

      // Create peer connection with ICE servers
      const configuration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" }
        ]
      }

      peerConnectionRef.current = new RTCPeerConnection(configuration)
      const pc = peerConnectionRef.current

      // Add local stream to peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current)
          console.log(`➕ MeetingRoom: Added ${track.kind} track to peer connection`)
        })
      }

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log("📺 MeetingRoom: Received remote stream:", event.streams[0])
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("🧊 MeetingRoom: ICE candidate generated")
          // Send candidate to remote peer via signaling server
          sendSignalingMessage({
            type: "ice-candidate",
            candidate: event.candidate
          })
        }
      }

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log("🔗 MeetingRoom: Connection state changed:", pc.connectionState)
        if (pc.connectionState === "connected") {
          toast.success("Peer connection established!")
        } else if (pc.connectionState === "failed") {
          toast.error("Peer connection failed")
        }
      }

      console.log("✅ MeetingRoom: WebRTC setup complete")

    } catch (error) {
      console.error("❌ MeetingRoom: WebRTC setup failed:", error)
      throw error
    }
  }

  /**
   * Set up WebSocket signaling for WebRTC
   * Handles offer/answer exchange and ICE candidates
   */
  const setupSignaling = () => {
    try {
      console.log("📡 MeetingRoom: Setting up signaling connection...")
      
      // In production, use WebSocket for real-time signaling
      // For now, we'll simulate the signaling process
      
      // Mock signaling - replace with actual WebSocket implementation
      console.log("🔄 MeetingRoom: Signaling setup complete (mock)")
      
    } catch (error) {
      console.error("❌ MeetingRoom: Signaling setup failed:", error)
    }
  }

  /**
   * Send signaling messages (offers, answers, ICE candidates)
   * In production, this would send via WebSocket
   */
  const sendSignalingMessage = (message) => {
    console.log("📤 MeetingRoom: Sending signaling message:", message.type)
    // In production, send via WebSocket to signaling server
    // socketRef.current?.send(JSON.stringify(message))
  }

  /**
   * Toggle local video on/off
   */
  const toggleVideo = async () => {
    try {
      const newVideoState = !localVideo
      console.log(`📹 MeetingRoom: Toggling video to ${newVideoState}`)

      if (localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0]
        if (videoTrack) {
          videoTrack.enabled = newVideoState
          setLocalVideo(newVideoState)
          
          // Notify other participants
          sendSignalingMessage({
            type: "media-state",
            video: newVideoState,
            audio: localAudio
          })
          
          toast.success(newVideoState ? "Camera turned on" : "Camera turned off")
        }
      }
    } catch (error) {
      console.error("❌ MeetingRoom: Failed to toggle video:", error)
      toast.error("Failed to toggle camera")
    }
  }

  /**
   * Toggle local audio on/off
   */
  const toggleAudio = async () => {
    try {
      const newAudioState = !localAudio
      console.log(`🎤 MeetingRoom: Toggling audio to ${newAudioState}`)

      if (localStreamRef.current) {
        const audioTrack = localStreamRef.current.getAudioTracks()[0]
        if (audioTrack) {
          audioTrack.enabled = newAudioState
          setLocalAudio(newAudioState)
          
          // Notify other participants
          sendSignalingMessage({
            type: "media-state",
            video: localVideo,
            audio: newAudioState
          })
          
          toast.success(newAudioState ? "Microphone unmuted" : "Microphone muted")
        }
      }
    } catch (error) {
      console.error("❌ MeetingRoom: Failed to toggle audio:", error)
      toast.error("Failed to toggle microphone")
    }
  }

  /**
   * Toggle screen sharing
   */
  const toggleScreenShare = async () => {
    try {
      console.log(`🖥️ MeetingRoom: Toggling screen share to ${!isScreenSharing}`)

      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })

        // Replace video track in peer connection
        if (peerConnectionRef.current) {
          const sender = peerConnectionRef.current.getSenders().find(
            s => s.track && s.track.kind === "video"
          )
          if (sender) {
            await sender.replaceTrack(screenStream.getVideoTracks()[0])
          }
        }

        setIsScreenSharing(true)
        toast.success("Screen sharing started")

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare()
        }

      } else {
        await stopScreenShare()
      }
    } catch (error) {
      console.error("❌ MeetingRoom: Screen sharing failed:", error)
      toast.error("Failed to share screen")
    }
  }

  /**
   * Stop screen sharing and return to camera
   */
  const stopScreenShare = async () => {
    try {
      console.log("🛑 MeetingRoom: Stopping screen share")

      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true })

      // Replace screen share track with camera track
      if (peerConnectionRef.current) {
        const sender = peerConnectionRef.current.getSenders().find(
          s => s.track && s.track.kind === "video"
        )
        if (sender) {
          await sender.replaceTrack(cameraStream.getVideoTracks()[0])
        }
      }

      setIsScreenSharing(false)
      toast.success("Screen sharing stopped")

    } catch (error) {
      console.error("❌ MeetingRoom: Failed to stop screen sharing:", error)
    }
  }

  /**
   * Send a chat message
   */
  const sendChatMessage = () => {
    if (!newMessage.trim()) return

    console.log("💬 MeetingRoom: Sending chat message:", newMessage)

    const message = {
      id: Date.now(),
      sender: user?.first_name || user?.username || "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString()
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage("")

    // Send to other participants via signaling
    sendSignalingMessage({
      type: "chat-message",
      message: message
    })
  }

  /**
   * End the meeting (tutor only)
   * Uses POST /api/meetings/end/<meeting_id>/ endpoint
   */
  const endMeeting = async () => {
    console.log("🛑 MeetingRoom: Ending meeting")
    
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        console.error("❌ MeetingRoom: No access token found")
        return
      }

      console.log("📡 MeetingRoom: Making end meeting request to /api/meetings/end/" + meetingId + "/")
      const response = await fetch(`${API_BASE}/api/meetings/end/${meetingId}/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("📥 MeetingRoom: End meeting response status:", response.status)

      if (response.ok) {
        console.log("✅ MeetingRoom: Meeting ended successfully")
        toast.success("Meeting ended")
      } else {
        console.error("❌ MeetingRoom: Failed to end meeting:", response.status)
        toast.error("Failed to end meeting")
      }

    } catch (error) {
      console.error("❌ MeetingRoom: End meeting error:", error)
      toast.error("Failed to end meeting")
    } finally {
      cleanup()
      
      // Redirect based on user type
      const dashboardPath = user?.user_type === "tutor" ? "/tutor/dashboard" : "/student/dashboard"
      console.log("🚀 MeetingRoom: Redirecting to:", dashboardPath)
      router.push(dashboardPath)
    }
  }

  /**
   * Leave the meeting
   */
  const leaveMeeting = async () => {
    console.log("👋 MeetingRoom: Leaving meeting")
    
    // Only tutors can end meetings, students just leave
    if (user?.user_type === "tutor") {
      await endMeeting()
    } else {
      cleanup()
      toast.success("Left meeting")
      router.push("/student/dashboard")
    }
  }

  /**
   * Clean up resources when leaving meeting
   */
  const cleanup = () => {
    console.log("🧹 MeetingRoom: Cleaning up resources...")

    // Stop all media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log(`🛑 MeetingRoom: Stopped ${track.kind} track`)
      })
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      console.log("🔌 MeetingRoom: Peer connection closed")
    }

    // Close WebSocket connection
    if (socketRef.current) {
      socketRef.current.close()
      console.log("📡 MeetingRoom: WebSocket connection closed")
    }
  }

  /**
   * Format meeting duration for display
   */
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  // Show loading state while meeting is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <h2 className="text-xl font-semibold text-white mb-2">Joining Meeting</h2>
            <p className="text-gray-400">Setting up video connection...</p>
            <p className="text-sm text-gray-500 mt-2">Meeting ID: {meetingId}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state if meeting failed to load
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-white mb-2">Meeting Error</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => {
                const dashboardPath = user?.user_type === "tutor" ? "/tutor/dashboard" : "/student/dashboard"
                router.push(dashboardPath)
              }} 
              variant="outline"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Meeting Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">
            {meetingData?.title || "Meeting Room"}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <span>Meeting ID: {meetingId}</span>
            <span>Duration: {formatDuration(meetingDuration)}</span>
            <Badge variant="secondary" className={`${
              connectionStatus === "connected" ? "bg-green-600" : "bg-red-600"
            }`}>
              {connectionStatus}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="text-white hover:bg-gray-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Participants ({participants.length + 1})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-white hover:bg-gray-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Local Video */}
            <Card className="bg-gray-800 border-gray-700 relative overflow-hidden">
              <CardContent className="p-0 h-full">
                {localVideo ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* Local Video Overlay */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">You ({user?.user_type})</span>
                    {!localAudio && <MicOff className="h-3 w-3" />}
                    {isScreenSharing && (
                      <Badge variant="secondary" className="text-xs bg-blue-600">
                        Sharing Screen
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remote Video */}
            <Card className="bg-gray-800 border-gray-700 relative overflow-hidden">
              <CardContent className="p-0 h-full">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Placeholder when no remote video */}
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-2" />
                    <p>Waiting for other participants...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Side Panel for Chat/Participants */}
        {(showChat || showParticipants) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {showParticipants && (
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-medium mb-3">
                  Participants ({participants.length + 1})
                </h3>
                <div className="space-y-2">
                  {/* Current user */}
                  <div className="flex items-center space-x-3 text-white">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user?.first_name?.charAt(0) || user?.username?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">You ({user?.user_type})</div>
                      <div className="flex items-center space-x-1">
                        {!localAudio && <MicOff className="h-3 w-3 text-red-400" />}
                        {!localVideo && <VideoOff className="h-3 w-3 text-red-400" />}
                        {isScreenSharing && <Monitor className="h-3 w-3 text-blue-400" />}
                      </div>
                    </div>
                  </div>
                  
                  {/* Other participants */}
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center space-x-3 text-white">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{participant.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {participant.name} ({participant.user_type})
                        </div>
                        <div className="flex items-center space-x-1">
                          {participant.muted && <MicOff className="h-3 w-3 text-red-400" />}
                          {!participant.video && <VideoOff className="h-3 w-3 text-red-400" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showChat && (
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-medium">Chat</h3>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {chatMessages.map((message) => (
                      <div key={message.id} className="text-white">
                        <div className="text-xs text-gray-400 mb-1">
                          {message.sender} • {message.timestamp}
                        </div>
                        <div className="text-sm">{message.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded text-sm"
                    />
                    <Button size="sm" onClick={sendChatMessage}>
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex justify-center items-center space-x-4">
          {/* Audio Toggle */}
          <Button
            variant={localAudio ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-12 h-12 p-0"
          >
            {localAudio ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>

          {/* Video Toggle */}
          <Button
            variant={localVideo ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-12 h-12 p-0"
          >
            {localVideo ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          {/* Screen Share Toggle */}
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full w-12 h-12 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
          </Button>

          {/* Leave/End Meeting */}
          <Button
            variant="destructive"
            size="lg"
            onClick={leaveMeeting}
            className="rounded-full w-12 h-12 p-0"
          >
            <Phone className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">
            {user?.user_type === "tutor" 
              ? "Click phone to end meeting for all participants"
              : "Click phone to leave meeting"
            }
          </p>
        </div>
      </div>
    </div>
  )
}
