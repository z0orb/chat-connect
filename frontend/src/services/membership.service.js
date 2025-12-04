import api from './api'

// Add member to room (creator only)
export const addMember = async (userId, roomId) => {
  const response = await api.post('/memberships', { userId, roomId })
  return response.data
}

// Join room with room ID
export const joinRoom = async (roomId) => {
  const response = await api.post('/memberships/join', { roomId })
  return response.data
}

// Leave room (self-leave)
export const leaveRoom = async (roomId) => {
  const response = await api.post('/memberships/leave', { roomId })
  return response.data
}

// Kick member from room (creator only)
export const kickMember = async (roomId, userId) => {
  const response = await api.delete(`/rooms/${roomId}/members/${userId}`)
  return response.data
}

// Get room members
export const getRoomMembers = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}/members`)
  return response.data
}
