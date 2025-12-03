import api from './api'

export async function getCurrentUser() {
  const response = await api.get('/users/me')
  return response.data
}

export async function updateProfile(userId, data) {
  const response = await api.patch(`/users/${userId}`, data)
  return response.data
}

export async function getUserById(userId) {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

export async function deleteUser(userId) {
  const response = await api.delete(`/users/${userId}`)
  return response.data
}
