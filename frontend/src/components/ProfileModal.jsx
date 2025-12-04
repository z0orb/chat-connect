import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import * as userService from '../services/user.service'

export default function ProfileModal({ onClose }) {
  const { user, setUser } = useAuth()
  const [bio, setBio] = useState(user?.bio || '')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleUpdateBio = async () => {
    try {
      setLoading(true)
      const updated = await userService.updateBio(user.id, bio)
      setUser(updated)
      alert('Bio updated successfully!')
      onClose()
    } catch (error) {
      console.error('Error updating bio:', error)
      alert('Failed to update bio')
    } finally {
      setLoading(false)
    }
  }

  const copyUserId = () => {
    navigator.clipboard.writeText(user.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', width: '500px', maxWidth: '90vw', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>Profile</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '40px' }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'white', margin: 0 }}>{user?.username}</h3>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your User ID (Share to join private rooms)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '8px' }}>
            <code style={{ flex: 1, color: '#e2e8f0', fontSize: '14px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{user?.id}</code>
            <button onClick={copyUserId} style={{ padding: '8px 16px', background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)', border: '1px solid', borderColor: copied ? 'rgba(34, 197, 94, 0.5)' : 'rgba(59, 130, 246, 0.5)', borderRadius: '6px', color: copied ? '#4ade80' : '#60a5fa', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={4} style={{ width: '100%', padding: '12px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '8px', color: 'white', fontSize: '14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '12px', background: 'rgba(71, 85, 105, 0.5)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleUpdateBio} disabled={loading} style={{ flex: 1, padding: '12px', background: loading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  )
}