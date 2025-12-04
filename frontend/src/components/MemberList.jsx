import { useState } from 'react'
import { useRoom } from '../hooks/useRoom'

export default function MemberList() {
  const { currentRoom } = useRoom()
  const [showAll, setShowAll] = useState(false)

  if (!currentRoom) {
    return null
  }

  // Safe array check - prevent crash!
  const members = Array.isArray(currentRoom.members) ? currentRoom.members : []
  const displayedMembers = showAll ? members : members.slice(0, 10)

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
            {displayedMembers.map((member) => (
              <div 
                key={member._id} 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '10px', transition: 'all 0.2s', cursor: 'pointer' }}
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
                    {member._id === currentRoom.creator?._id || member._id === currentRoom.creator ? 'Creator' : 'Member'}
                  </p>
                </div>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }}></div>
              </div>
            ))}
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
    </div>
  )
}
