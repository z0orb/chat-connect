import api from './api'

// Get all messages
export const getAllMessages = async (roomId) => {
  const response = await api.get('/messages', { params: { roomId } })
  return response.data.data
}

// Send a message
export const sendMessage = async (payload) => {
  const response = await api.post('/messages', payload)
  return response.data.data
}

// Edit a message
export const editMessage = async (messageId, content) => {
  const response = await api.patch(`/messages/${messageId}`, { content })
  return response.data.data
}

// Delete a message
export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`)
  return response.data
}
