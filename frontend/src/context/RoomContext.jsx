import { createContext, useState } from 'react'

export const RoomContext = createContext()

export const RoomProvider = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState(null)
  const [rooms, setRooms] = useState([])
  const [messages, setMessages] = useState([])

  const selectRoom = (room) => {
    // Ensure members is always an array
    const normalizedRoom = {
      ...room,
      members: Array.isArray(room.members) ? room.members : []
    }
    setCurrentRoom(normalizedRoom)
    setMessages([]) // Clear messages when switching rooms
  }

  const addRoom = (room) => {
    setRooms(prev => [...prev, room])
  }

  const updateRoom = (roomId, updatedData) => {
    setRooms(prev => prev.map(room => room._id === roomId ? { ...room, ...updatedData } : room))
    if (currentRoom?._id === roomId) {
      setCurrentRoom(prev => ({ ...prev, ...updatedData }))
    }
  }

  const removeRoom = (roomId) => {
    setRooms(prev => prev.filter(room => room._id !== roomId))
    if (currentRoom?._id === roomId) {
      setCurrentRoom(null)
    }
  }

  const addMessage = (message) => {
    setMessages(prev => [...prev, message])
  }

  const updateMessage = (messageId, updatedData) => {
    setMessages(prev => prev.map(msg => msg._id === messageId ? { ...msg, ...updatedData } : msg))
  }

  const deleteMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg._id !== messageId))
  }

  return (
    <RoomContext.Provider value={{
      currentRoom,
      rooms,
      messages,
      setCurrentRoom,
      selectRoom,
      setRooms,
      setMessages,
      addRoom,
      updateRoom,
      removeRoom,
      addMessage,
      updateMessage,
      deleteMessage
    }}>
      {children}
    </RoomContext.Provider>
  )
}
