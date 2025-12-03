import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom.js'
import * as roomService from '../services/room.service'
import CreateRoomModal from './CreateRoomModal'
import JoinRoomModal from './JoinRoomModal'

export default function Sidebar() {
  const navigate = useNavigate()
  const { rooms, setRooms, setCurrentRoom, currentRoom } = useRoom()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const data = await roomService.getAllRooms()
      setRooms(data)
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectRoom = (room) => {
    setCurrentRoom(room)
    navigate(`/rooms/${room._id}`)
  }

  return (
    <>
      <div style={{ width: '280px', backgroundColor: '#1e293b', borderRight: '1px solid rgba(71, 85, 105, 0.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
        {/* Header */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(71, 85, 105, 0.5)', flexShrink: 0 }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>Rooms</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowCreateModal(true)} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}>
              + Create
            </button>
            <button onClick={() => setShowJoinModal(true)} style={{ flex: 1, padding: '10px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
              Join
            </button>
          </div>
        </div>

        {/* Rooms List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px', minHeight: 0 }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Loading...</div>
          ) : rooms.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No rooms yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {rooms.map((room) => (
                <button key={room._id} onClick={() => handleSelectRoom(room)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: currentRoom?._id === room._id ? 'rgba(59, 130, 246, 0.2)' : 'transparent', border: currentRoom?._id === room._id ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid transparent', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} onMouseOver={(e) => { if (currentRoom?._id !== room._id) e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'; }} onMouseOut={(e) => { if (currentRoom?._id !== room._id) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                    {room.roomName?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'white', fontSize: '15px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.roomName}</p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{room.memberCount} members</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(71, 85, 105, 0.5)', flexShrink: 0 }}>
          <button onClick={fetchRooms} style={{ width: '100%', padding: '10px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
            Refresh
          </button>
        </div>
      </div>

      {showCreateModal && <CreateRoomModal onClose={() => setShowCreateModal(false)} onCreated={fetchRooms} />}
      {showJoinModal && <JoinRoomModal onClose={() => setShowJoinModal(false)} onJoined={fetchRooms} />}
    </>
  )
}
