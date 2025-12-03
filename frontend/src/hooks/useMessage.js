import { useState } from 'react'
import * as messageService from '../services/message.service'
import { useRoom } from './useRoom.js'

export const useMessage = () => {
  const { setMessages } = useRoom()
  const [loading, setLoading] = useState(false)

  const fetchMessages = async (roomId) => {
    try {
      setLoading(true)
      const data = await messageService.getMessagesByRoom(roomId)
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([]) // Set empty array on error
      throw error
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (roomId, content) => {
    const data = await messageService.sendMessage(roomId, content)
    return data
  }

  const editMessage = async (messageId, content) => {
    const data = await messageService.editMessage(messageId, content)
    return data
  }

  const removeMessage = async (messageId) => {
    await messageService.deleteMessage(messageId)
  }

  return {
    loading,
    fetchMessages,
    sendMessage,
    editMessage,
    removeMessage
  }
}
