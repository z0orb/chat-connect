import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useMessage } from '../hooks/useMessage'
import { useRoom } from '../hooks/useRoom.js'
import { formatTime } from '../utils/formatDate'

export default function MessageItem({ message }) {
  const { user } = useAuth()
  const { currentRoom } = useRoom()
  const { editMessage, removeMessage } = useMessage()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const isOwnMessage = message.sender._id === user?._id
  const canEdit = isOwnMessage
  const canDelete = isOwnMessage || currentRoom?.creator === user?._id

  const handleEdit = async () => {
    if (!editedContent.trim()) return
    try {
      await editMessage(message._id, editedContent)
      setIsEditing(false)
    } catch (error) {
      alert('Failed to edit message')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this message?')) return
    try {
      setIsDeleting(true)
      await removeMessage(message._id)
    } catch (error) {
      alert('Failed to delete message')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '12px', flexDirection: isOwnMessage ? 'row-reverse' : 'row', alignItems: 'flex-start' }} onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      {/* Avatar */}
      <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
        {message.sender.username?.[0]?.toUpperCase()}
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: '65%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexDirection: isOwnMessage ? 'row-reverse' : 'row' }}>
          <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600', margin: 0 }}>{message.sender.username}</p>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{formatTime(message.createdAt)}</p>
          {message.isEdited && <p style={{ color: '#64748b', fontSize: '11px', margin: 0, fontStyle: 'italic' }}>(edited)</p>}
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none' }}
            />
            <button onClick={handleEdit} style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Save
            </button>
            <button onClick={() => setIsEditing(false)} style={{ padding: '10px 16px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: 'inline-block', padding: '12px 16px', background: isOwnMessage ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(51, 65, 85, 0.6)', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <p style={{ color: 'white', fontSize: '15px', margin: 0, wordBreak: 'break-word' }}>{message.content}</p>
          </div>
        )}

        {/* Actions */}
        {(canEdit || canDelete) && !isEditing && showActions && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '13px' }}>
            {canEdit && (
              <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: 0, fontWeight: '600' }}>
                Edit
              </button>
            )}
            {canDelete && (
              <button onClick={handleDelete} disabled={isDeleting} style={{ background: 'none', border: 'none', color: '#f87171', cursor: isDeleting ? 'not-allowed' : 'pointer', padding: 0, fontWeight: '600', opacity: isDeleting ? 0.5 : 1 }}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
