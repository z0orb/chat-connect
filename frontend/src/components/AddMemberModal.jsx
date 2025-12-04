import { useState } from 'react'
import * as membershipService from '../services/membership.service'

export default function AddMemberModal({ roomId, onClose, onAdded }) {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!userId.trim()) {
      alert('Please enter a User ID')
      return
    }

    try {
      setLoading(true)
      await membershipService.addMember(userId.trim(), roomId)
      alert('Member added successfully!')
      onAdded()
      onClose()
    } catch (error) {
      console.error('Error adding member:', error)
      alert(error.response?.data?.error || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '32px', width: '500px', maxWidth: '90vw', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', margin: 0 }}>Add Member</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer', padding: '4px', lineHeight: 1 }}>✕</button>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
          Enter the User ID to add them to this private room
        </p>

        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Paste User ID here..."
          style={{ width: '100%', padding: '12px 16px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '8px', color: 'white', fontSize: '14px', marginBottom: '24px', outline: 'none', fontFamily: 'monospace' }}
        />

        <button
          onClick={handleAdd}
          disabled={loading || !userId.trim()}
          style={{ 
            width: '100%',
            padding: '12px', 
            background: (loading || !userId.trim()) ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', 
            border: 'none', 
            borderRadius: '8px', 
            color: 'white', 
            fontSize: '16px', 
            fontWeight: '600', 
            cursor: (loading || !userId.trim()) ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>
      </div>
    </div>
  )
}
