import { useState } from 'react'
import * as membershipService from '../services/membership.service'

export default function AddMemberModal({ roomId, onClose, onAdded }) {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAdd = async () => {
    if (!userId.trim()) {
      setError('Please enter a User ID')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await membershipService.addMember(roomId, userId.trim())
      onAdded()
      onClose()
    } catch (error) {
      console.error('Error adding member:', error)
      setError(error.response?.data?.error || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', width: '90%', maxWidth: '500px', padding: '24px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>Add Member</h2>
          <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Enter the User ID to add them to this private room</p>

        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Paste User ID here..."
          style={{ width: '100%', padding: '12px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '8px', color: 'white', fontSize: '14px', marginBottom: '16px' }}
        />

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: loading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </div>
    </div>
  )
}
