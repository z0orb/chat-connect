import axios from 'axios'

const API_URL = 'http://localhost:5000/api/messages'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getMessagesByRoom = async (roomId) => {
  try {
    // Use query params instead of path params
    const response = await axios.get(`${API_URL}?roomId=${roomId}`, {
      headers: getAuthHeader()
    })
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

export const sendMessage = async (roomId, content) => {
  const response = await axios.post(
    API_URL,
    { roomId, content },
    { headers: getAuthHeader() }
  )
  return response.data.data || response.data
}

export const editMessage = async (messageId, content) => {
  const response = await axios.patch(
    `${API_URL}/${messageId}`,
    { content },
    { headers: getAuthHeader() }
  )
  return response.data.data || response.data
}

export const deleteMessage = async (messageId) => {
  const response = await axios.delete(`${API_URL}/${messageId}`, {
    headers: getAuthHeader()
  })
  return response.data
}
