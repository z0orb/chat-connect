import { useRoom } from './useRoom.js'
import * as membershipService from '../services/membership.service'

export function useMembership() {
  const { members, setMembers, addMember, removeMember, updateMemberRole } = useRoom()

  const fetchMembers = async (roomId) => {
    try {
      const mems = await membershipService.getRoomMembers(roomId)
      setMembers(mems)
      return mems
    } catch (error) {
      console.error('Error fetching members:', error)
      throw error
    }
  }

  const joinRoom = async (roomId) => {
    try {
      const result = await membershipService.joinRoom(roomId)
      addMember(result)
      return result
    } catch (error) {
      console.error('Error joining room:', error)
      throw error
    }
  }

  const addUserToRoom = async (roomId, userId) => {
    try {
      const result = await membershipService.addUserToRoom(roomId, userId)
      addMember(result)
      return result
    } catch (error) {
      console.error('Error adding user to room:', error)
      throw error
    }
  }

  const removeUserFromRoom = async (roomId, userId) => {
    try {
      await membershipService.removeUserFromRoom(roomId, userId)
      removeMember(userId)
    } catch (error) {
      console.error('Error removing user:', error)
      throw error
    }
  }

  const changeUserRole = async (roomId, userId, newRole) => {
    try {
      const result = await membershipService.updateMemberRole(roomId, userId, newRole)
      updateMemberRole(userId, newRole)
      return result
    } catch (error) {
      console.error('Error changing role:', error)
      throw error
    }
  }

  return {
    members,
    fetchMembers,
    joinRoom,
    addUserToRoom,
    removeUserFromRoom,
    changeUserRole,
  }
}
