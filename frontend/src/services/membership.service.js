import api from './api'

export async function getRoomMembers(roomId) {
  const response = await api.get(`/rooms/${roomId}/members`)
  return response.data
}

export async function joinRoom(roomId) {
  const response = await api.post(`/memberships/join`, { roomId })
  return response.data
}

export async function addUserToRoom(roomId, userId) {
  const response = await api.post('/memberships', { roomId, userId })
  return response.data
}

export async function removeUserFromRoom(roomId, userId) {
  const response = await api.delete(`/rooms/${roomId}/members/${userId}`)
  return response.data
}

export async function updateMemberRole(roomId, userId, role) {
  const response = await api.patch(`/rooms/${roomId}/members/${userId}`, { role })
  return response.data
}

export async function leaveRoom(roomId) {
  const response = await api.post(`/memberships/leave`, { roomId })
  return response.data
}
