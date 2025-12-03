import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import ProfileModal from './ProfileModal'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <nav style={{ backgroundColor: '#1e293b', borderBottom: '1px solid rgba(71, 85, 105, 0.5)', padding: '16px 24px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '100%', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: 0 }}>Chat Connect</h1>
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setShowProfile(true)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 16px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.8)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px' }}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>{user?.username}</span>
            </button>

            <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#fca5a5', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  )
}
