import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as roomService from '../services/room.service'
import ChatArea from '../components/ChatArea'
import AddMemberModal from '../components/AddMemberModal'

export default function RoomPage() {
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (roomId) {
      fetchRoomData()
    }
  }, [roomId])

  const fetchRoomData = async () => {
    try {
      setLoading(true)
      const data = await roomService.getRoomById(roomId)
      setRoom(data)
    } catch (error) {
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(room._id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid rgba(59, 130, 246, 0.3)', borderTop: '4px solid #3b82f6', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }}></div>
          <p style={{ color: '#94a3b8', fontSize: '16px' }}>Loading room...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ fontSize: '40px' }}>🚫</span>
          </div>
          <p style={{ color: '#f87171', fontSize: '18px', fontWeight: '600' }}>Room not found</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Room Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(71, 85, 105, 0.5)', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '20px' }}>
              {room.roomName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>{room.roomName}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px', marginTop: '2px' }}>
                <span>{room.memberCount} members</span>
                <span>•</span>
                <span>{room.isPrivate ? '🔒 Private' : '🌐 Public'}</span>
                {!room.isPrivate && (
                  <>
                    <span>•</span>
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>{room._id}</span>
                    <button
                      onClick={copyRoomId}
                      title="Copy Room ID"
                      style={{ 
                        padding: '4px 8px', 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        color: copied ? '#4ade80' : '#64748b',
                        fontSize: '14px',
                        transition: 'color 0.2s'
                      }}
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {room.isPrivate && (
            <button
              onClick={() => setShowAddMember(true)}
              style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              + Add Member
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <ChatArea room={room} />

      {showAddMember && (
        <AddMemberModal
          roomId={room._id}
          onClose={() => setShowAddMember(false)}
          onAdded={fetchRoomData}
        />
      )}
    </div>
  )
}
