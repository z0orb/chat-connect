import api from './api';

// Join a public room (Self-join) - Endpoint 21
export const joinRoom = async (roomId) => {
  const response = await api.post('/memberships/join', { roomId });
  return response.data;
};

// Leave a room (Self-leave) - Endpoint 23
export const leaveRoom = async (roomId) => {
  const response = await api.post('/memberships/leave', { roomId });
  return response.data;
};

// Get all members in a room - Endpoint 18
export const getRoomMembers = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}/members`);
  return response.data.data;
};

// Add member to room (by admin/creator) - Endpoint 20
export const addMember = async (userId, roomId) => {
  const response = await api.post('/memberships', { userId, roomId });
  return response.data;
};

// Update member role - Endpoint 22
export const updateMemberRole = async (roomId, userId, role) => {
  const response = await api.patch(`/rooms/${roomId}/members/${userId}`, { role });
  return response.data;
};

// Kick member from room - Endpoint 24
export const kickMember = async (roomId, userId) => {
  const response = await api.delete(`/rooms/${roomId}/members/${userId}`);
  return response.data;
};
