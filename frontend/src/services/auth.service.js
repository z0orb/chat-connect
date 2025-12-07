import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : 'http://localhost:5000/api/auth'

export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/register`, { username, password })
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
  }
  return response.data
}

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, { username, password })
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
  }
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}