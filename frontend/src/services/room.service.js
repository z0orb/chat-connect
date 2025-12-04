import api from './api'

// Get all rooms
export const getAllRooms = async () => {
  const response = await api.get('/rooms')
  return response.data.data
}

// Create a room
export const createRoom = async (payload) => {
  const response = await api.post('/rooms', payload)
  return response.data.data
}

// Get room by ID
export const getRoomById = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}`)
  return response.data.data
}

// Delete a room
export const deleteRoom = async (roomId) => {
  const response = await api.delete(`/rooms/${roomId}`)
  return response.data
}

// Update a room
export const updateRoom = async (roomId, payload) => {
  const response = await api.patch(`/rooms/${roomId}`, payload)
  return response.data.data
}
