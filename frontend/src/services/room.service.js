import axios from 'axios'

const API_URL = 'http://localhost:5000/api/rooms'

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const createRoom = async (roomData) => {
  const response = await axios.post(API_URL, roomData, {
    headers: getAuthHeader()
  })
  return response.data.data // ← Extract 'data' from response
}

export const getAllRooms = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader()
  })
  return response.data.data // ← Extract 'data' from response
}

export const getPublicRooms = async () => {
  const response = await axios.get(`${API_URL}`, {
    headers: getAuthHeader()
  })
  return response.data.data // ← Extract 'data' from response
}

export const getRoomById = async (roomId) => {
  const response = await axios.get(`${API_URL}/${roomId}`, {
    headers: getAuthHeader()
  })
  return response.data.data // ← Extract 'data' from response
}

export const updateRoom = async (roomId, roomData) => {
  const response = await axios.patch(`${API_URL}/${roomId}`, roomData, {
    headers: getAuthHeader()
  })
  return response.data.data // ← Extract 'data' from response
}

export const deleteRoom = async (roomId) => {
  const response = await axios.delete(`${API_URL}/${roomId}`, {
    headers: getAuthHeader()
  })
  return response.data
}
