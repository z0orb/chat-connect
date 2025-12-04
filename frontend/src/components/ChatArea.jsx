import { useState, useEffect, useRef } from 'react'
import * as messageService from '../services/message.service'
import { useAuth } from '../hooks/useAuth'
import { useAbly } from '../hooks/useAbly'

export default function ChatArea({ room }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const { user } = useAuth()
  const ably = useAbly()

  useEffect(() => {
    if (room?._id) {
      fetchMessages()
    }
  }, [room?._id])

  useEffect(() => {
    if (!ably || !room?._id) return

    console.log('🔌 Connecting to Ably channel:', `rooms:${room._id}`)
    
    const channel = ably.channels.get(`rooms:${room._id}`)
    
    // Subscribe to new messages
    channel.subscribe('receive_message', (message) => {
      console.log('📩 New message received:', message.data)
      
      // Transform backend data to match expected format
      const formattedMessage = {
        _id: message.data._id || message.data.messageId,
        content: message.data.content || message.data.message,
        sender: message.data.sender || {
          username: message.data.username,
          _id: message.data.userId
        },
        room: message.data.room || room,
        createdAt: message.data.createdAt || message.data.timestamp,
        isEdited: message.data.isEdited || false
      }
      
      // Check if message already exists (avoid duplicates)
      setMessages((prev) => {
        const exists = prev.some(m => m._id === formattedMessage._id)
        if (exists) return prev
        return [...prev, formattedMessage]
      })
      
      setTimeout(scrollToBottom, 100)
    })

    // Subscribe to deleted messages
    channel.subscribe('message_deleted', (message) => {
      console.log('🗑️ Message deleted:', message.data)
      setMessages((prev) => prev.filter(m => m._id !== message.data.messageId))
    })

    // Subscribe to edited messages
    channel.subscribe('message_edited', (message) => {
      console.log('✏️ Message edited:', message.data)
      setMessages((prev) =>
        prev.map(m => {
          if (m._id === message.data.messageId) {
            return {
              ...m,
              content: message.data.newContent,
              isEdited: true,
              editedAt: message.data.editedAt
            }
          }
          return m
        })
      )
    })

    return () => {
      console.log('🔌 Disconnecting from Ably channel')
      channel.unsubscribe()
    }
  }, [room?._id, ably])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const data = await messageService.getAllMessages(room._id)
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      await messageService.sendMessage({
        roomId: room._id,
        content: newMessage.trim()
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (loading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(59, 130, 246, 0.3)', borderTop: '3px solid #3b82f6', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }}></div>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <span style={{ fontSize: '32px' }}>💬</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '16px' }}>No messages yet</p>
              <p style={{ color: '#475569', fontSize: '14px' }}>Be the first to say something!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                {msg.sender?.username?.[0]?.toUpperCase() || 'U'}
              </div>

              {/* Message Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ color: 'white', fontSize: '15px', fontWeight: '600' }}>
                    {msg.sender?.username || 'Unknown'}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.isEdited && (
                    <span style={{ color: '#64748b', fontSize: '11px', fontStyle: 'italic' }}>(edited)</span>
                  )}
                </div>
                <div style={{ background: 'rgba(51, 65, 85, 0.5)', padding: '10px 14px', borderRadius: '10px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.5', wordBreak: 'break-word' }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div style={{ padding: '20px', borderTop: '1px solid rgba(71, 85, 105, 0.5)', background: '#1e293b' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '12px 16px', background: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            style={{ padding: '12px 24px', background: newMessage.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(51, 65, 85, 0.5)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
