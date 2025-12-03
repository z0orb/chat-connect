import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as roomService from '../services/room.service'
import * as membershipService from '../services/membership.service'

export default function JoinRoomModal({ onClose, onJoined }) {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [loading, setLoading] = useState(false)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPublicRooms()
  }, [])

  const fetchPublicRooms = async () => {
    try {
      setLoading(true)
      const data = await roomService.getPublicRooms()
      setRooms(data.filter(room => !room.isPrivate))
    } catch (error) {
      setError('Failed to fetch public rooms')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!selectedRoomId) return

    try {
      setJoining(true)
      await membershipService.joinRoom(selectedRoomId)
      onJoined()
      navigate(`/rooms/${selectedRoomId}`)
      onClose()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join room')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#1e293b', borderRadius: '20px', border: '1px solid rgba(71, 85, 105, 0.5)', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(71, 85, 105, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'white', margin: 0 }}>Join Room</h2>
          <button onClick={onClose} style={{ width: '32px', height: '32px', background: 'rgba(51, 65, 85, 0.5)', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'}>
            <svg style={{ width: '18px', height: '18px', color: '#e2e8f0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px' }}>
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg style={{ width: '18px', height: '18px', color: '#fca5a5', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p style={{ color: '#fca5a5', fontSize: '14px', fontWeight: '500', margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Select Room</label>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(59, 130, 246, 0.3)', borderTop: '3px solid #3b82f6', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }}></div>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '12px' }}>Loading rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '10px' }}>
                <svg style={{ width: '48px', height: '48px', color: '#64748b', margin: '0 auto 12px' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>No public rooms available</p>
              </div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '10px', padding: '8px' }}>
                {rooms.map((room) => (
                  <button
                    key={room._id}
                    onClick={() => setSelectedRoomId(room._id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: selectedRoomId === room._id ? 'rgba(59, 130, 246, 0.2)' : 'transparent', border: selectedRoomId === room._id ? '2px solid rgba(59, 130, 246, 0.5)' : '2px solid transparent', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '6px', textAlign: 'left' }}
                    onMouseOver={(e) => { if (selectedRoomId !== room._id) e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'; }}
                    onMouseOut={(e) => { if (selectedRoomId !== room._id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                      {room.roomName?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'white', fontSize: '15px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{room.roomName}</p>
                      <p style={{ color: '#94a3b8', fontSize: '13px', margin: '2px 0 0' }}>{room.memberCount} members</p>
                    </div>
                    {selectedRoomId === room._id && (
                      <svg style={{ width: '20px', height: '20px', color: '#60a5fa', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleJoin}
              disabled={!selectedRoomId || joining || loading}
              style={{ flex: 1, padding: '12px 20px', background: !selectedRoomId || joining || loading ? 'rgba(59, 130, 246, 0.3)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: !selectedRoomId || joining || loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: !selectedRoomId || joining || loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)' }}
            >
              {joining ? 'Joining...' : 'Join Room'}
            </button>
            <button
              onClick={onClose}
              disabled={joining}
              style={{ flex: 1, padding: '12px 20px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '10px', color: '#e2e8f0', fontSize: '15px', fontWeight: '600', cursor: joining ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
