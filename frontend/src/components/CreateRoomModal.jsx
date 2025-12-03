import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as roomService from '../services/room.service'
import { validateRoomName } from '../utils/validateForm'

export default function CreateRoomModal({ onClose, onCreated }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ roomName: '', description: '', isPrivate: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const nameError = validateRoomName(formData.roomName)
    if (nameError) {
      setError(nameError)
      return
    }

    try {
      setLoading(true)
      const room = await roomService.createRoom({ roomName: formData.roomName, description: formData.description, isPrivate: formData.isPrivate })
      onCreated()
      navigate(`/rooms/${room._id}`)
      onClose()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '20px' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#1e293b', borderRadius: '20px', border: '1px solid rgba(71, 85, 105, 0.5)', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(71, 85, 105, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'white', margin: 0 }}>Create Room</h2>
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

          <form onSubmit={handleSubmit}>
            {/* Room Name */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Room Name</label>
              <input
                type="text"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter room name"
                style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '10px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.7)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'; e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.5)'; }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#e2e8f0', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Description (optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                placeholder="Room description"
                rows="3"
                style={{ width: '100%', padding: '12px 16px', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '10px', color: 'white', fontSize: '15px', outline: 'none', resize: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.7)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'; e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.5)'; }}
              />
            </div>

            {/* Private Checkbox */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '10px', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.5)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.3)'}>
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={formData.isPrivate}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: '500' }}>Make this room private</span>
              </label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{ flex: 1, padding: '12px 20px', background: loading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)' }}
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{ flex: 1, padding: '12px 20px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '10px', color: '#e2e8f0', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
