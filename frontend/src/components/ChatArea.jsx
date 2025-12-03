import { useEffect, useState, useRef } from 'react'
import { useRoom } from '../hooks/useRoom'
import { useMessage } from '../hooks/useMessage'
import { useAbly } from '../hooks/useAbly'
import MessageItem from './MessageItem'

export default function ChatArea() {
  const { currentRoom, messages, setMessages, addMessage, updateMessage, deleteMessage } = useRoom()
  const { sendMessage, fetchMessages } = useMessage()
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const channel = useAbly(currentRoom?._id ? `rooms:${currentRoom._id}` : null)

  useEffect(() => {
    if (currentRoom) {
      loadMessages()
    } else {
      setMessages([])
    }
  }, [currentRoom?._id])

  const loadMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      await fetchMessages(currentRoom._id)
    } catch (error) {
      console.error('Error loading messages:', error)
      setError('Failed to load messages')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!channel) return

    const handleMessage = (ablyMessage) => {
      try {
        console.log('Ably message received:', ablyMessage.name, ablyMessage.data)
        
        if (ablyMessage.name === 'receive_message') {
          // Transform Ably message format to match database format
          const transformedMessage = {
            _id: ablyMessage.data.messageId,
            content: ablyMessage.data.message,
            sender: {
              _id: ablyMessage.data.userId,
              username: ablyMessage.data.username
            },
            createdAt: ablyMessage.data.timestamp,
            room: currentRoom._id
          }
          addMessage(transformedMessage)
        } else if (ablyMessage.name === 'message_edited') {
          updateMessage(ablyMessage.data.messageId, {
            content: ablyMessage.data.newContent,
            isEdited: true,
            editedAt: ablyMessage.data.editedAt
          })
        } else if (ablyMessage.name === 'message_deleted') {
          deleteMessage(ablyMessage.data.messageId || ablyMessage.data._id)
        }
      } catch (error) {
        console.error('Error handling Ably message:', error)
      }
    }

    channel.subscribe(handleMessage)

    // Proper cleanup
    return () => {
      channel.unsubscribe(handleMessage)
    }
  }, [channel, currentRoom])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || !currentRoom) return

    try {
      setSending(true)
      await sendMessage(currentRoom._id, inputValue.trim())
      setInputValue('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (!currentRoom) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg style={{ width: '40px', height: '40px', color: '#64748b' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
          </div>
          <p style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No room selected</p>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Select or create a room to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1e293b', borderBottom: '1px solid rgba(71, 85, 105, 0.5)', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '20px' }}>
            {currentRoom.roomName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: '700', margin: 0 }}>{currentRoom.roomName}</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0' }}>{currentRoom.description || 'No description'}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(59, 130, 246, 0.3)', borderTop: '3px solid #3b82f6', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }}></div>
              <p style={{ color: '#94a3b8', fontSize: '15px' }}>Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg style={{ width: '32px', height: '32px', color: '#f87171' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <p style={{ color: '#f87171', fontSize: '15px', marginBottom: '12px' }}>{error}</p>
              <button onClick={loadMessages} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Try Again
              </button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(51, 65, 85, 0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '32px' }}>👋</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '15px' }}>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((message) => (
              <MessageItem key={message._id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ backgroundColor: '#1e293b', borderTop: '1px solid rgba(71, 85, 105, 0.5)', padding: '20px 24px' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            style={{ flex: 1, padding: '14px 20px', backgroundColor: 'rgba(51, 65, 85, 0.5)', border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none', transition: 'all 0.2s' }}
            onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.7)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(71, 85, 105, 0.5)'; e.target.style.backgroundColor = 'rgba(51, 65, 85, 0.5)'; }}
          />
          <button
            type="submit"
            disabled={sending || !inputValue.trim()}
            style={{ padding: '14px 28px', background: sending || !inputValue.trim() ? 'rgba(59, 130, 246, 0.3)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: sending || !inputValue.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: sending || !inputValue.trim() ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)' }}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
