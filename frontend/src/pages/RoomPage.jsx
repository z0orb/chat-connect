import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import * as roomService from '../services/room.service'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import ChatArea from '../components/ChatArea'
import MemberList from '../components/MemberList'

export default function RoomPage() {
  const { roomId } = useParams()
  const { selectRoom, currentRoom } = useRoom()

  useEffect(() => {
    if (roomId && (!currentRoom || currentRoom._id !== roomId)) {
      fetchRoomData()
    }
  }, [roomId])

  const fetchRoomData = async () => {
    try {
      const room = await roomService.getRoomById(roomId)
      selectRoom(room)
    } catch (error) {
      console.error('Error fetching room:', error)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#0f172a' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <Sidebar />
        <ChatArea />
        <MemberList />
      </div>
    </div>
  )
}
