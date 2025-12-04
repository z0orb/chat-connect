import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom.js'
import { useAuth } from '../hooks/useAuth'
import * as membershipService from '../services/membership.service'

export default function MemberList() {
  const navigate = useNavigate()
  const { currentRoom, selectRoom } = useRoom()
  const { user } = useAuth()
  const [showAll, setShowAll] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [kickingUserId, setKickingUserId] = useState(null)

  if (!currentRoom) {
    return null
  }

  const members = Array.isArray(currentRoom.members) ? currentRoom.members : []
  const displayedMembers = showAll ? members : members.slice(0, 10)

  const isCreator = currentRoom.creator?._id === user?.id || currentRoom.creator === user?.id
  const isMember = members.some(m => m._id === user?.id)

  const handleLeaveRoom = async () => {
    if (!window.confirm('Are you sure you want to leave this room?')) {
      return
    }

    try {
      setLeaving(true)
      await membershipService.leaveRoom(currentRoom._id)
      alert('Left room successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error leaving room:', error)
      alert(error.response?.data?.error || 'Failed to leave room')
    } finally {
      setLeaving(false)
    }
  }

  const handleKickMember = async (memberId, memberName, e) => {
    e.stopPropagation()
    
    if (!window.confirm(`Are you sure you want to kick ${memberName} from this room?`)) {
      return
    }

    try {
      setKickingUserId(memberId)
      await membershipService.kickMember(currentRoom._id, memberId)
      
      // Refresh room data
      const updatedRoom = {
        ...currentRoom,
        members: currentRoom.members.filter(m => m._id !== memberId),
        memberCount: currentRoom.memberCount - 1
      }
      selectRoom(updatedRoom)
      
      alert('Member kicked successfully!')
    } catch (error) {
      console.error('Error kicking member:', error)
      alert(error.response?.data?.error || 'Failed to kick member')
    } finally {
      setKickingUserId(null)
    }
  }

  return (
    <div style={{ width: '280px', backgroundColor: '#1e293b', borderLeft: '1px solid rgba(71, 85, 105, 0.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(71, 85, 105, 0.5)' }}>
        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg style={{ width: '18px', height: '18px', color: '#3b82f6' }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
          Members ({members.length})
        </h3>
      </div>

      {/* Members List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg style={{ width: '24px', height: '24px', color: '#64748b' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
            <p style={{ color: '#64748b', fontSize: '14px' }}>No members yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedMembers.map((member) => {
              const isMemberCreator = member._id === currentRoom.creator?._id || member._id === currentRoom.creator
              const canKick = isCreator && !isMemberCreator
              
              return (
                <div 
                  key={member._id} 
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '10px', transition: 'all 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.3)'}
                >
                  <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
                    {member.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.username || 'Unknown User'}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0' }}>
                      {isMemberCreator ? 'Creator' : 'Member'}
                    </p>
                  </div>
                  
                  {/* Kick Button - Only for creator, not on creator member */}
                  {canKick ? (
                    <button
                      onClick={(e) => handleKickMember(member._id, member.username, e)}
                      disabled={kickingUserId === member._id}
                      style={{ 
                        padding: '6px 12px', 
                        background: kickingUserId === member._id ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.2)', 
                        border: '1px solid rgba(239, 68, 68, 0.5)', 
                        borderRadius: '6px', 
                        color: '#ef4444', 
                        fontSize: '12px', 
                        fontWeight: '600',
                        cursor: kickingUserId === member._id ? 'not-allowed' : 'pointer', 
                        flexShrink: 0 
                      }}
                      title="Kick Member"
                    >
                      {kickingUserId === member._id ? '...' : 'Kick'}
                    </button>
                  ) : (
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }}></div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Show More Button */}
        {members.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{ width: '100%', marginTop: '12px', padding: '10px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', color: '#60a5fa', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.target.style.background = 'rgba(59, 130, 246, 0.2)'; e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)'; }}
            onMouseOut={(e) => { e.target.style.background = 'rgba(59, 130, 246, 0.1)'; e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'; }}
          >
            {showAll ? 'Show Less' : `Show All (${members.length})`}
          </button>
        )}
      </div>

      {/* Leave Room Button - Only for non-creator members */}
      {isMember && !isCreator && (
        <div style={{ padding: '16px', borderTop: '1px solid rgba(71, 85, 105, 0.5)' }}>
          <button
            onClick={handleLeaveRoom}
            disabled={leaving}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: leaving ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.5)', 
              borderRadius: '8px', 
              color: '#ef4444', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: leaving ? 'not-allowed' : 'pointer', 
              transition: 'all 0.2s' 
            }}
            onMouseOver={(e) => { if (!leaving) e.target.style.background = 'rgba(239, 68, 68, 0.2)'; }}
            onMouseOut={(e) => { if (!leaving) e.target.style.background = 'rgba(239, 68, 68, 0.1)'; }}
          >
            {leaving ? 'Leaving...' : '🚪 Leave Room'}
          </button>
        </div>
      )}
    </div>
  )
}
