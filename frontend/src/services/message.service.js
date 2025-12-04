import api from './api';

export const getAllMessages = async (roomId) => {
  const response = await api.get('/messages', { 
    params: { roomId } 
  });
  return response.data.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data.data;
};

export const editMessage = async (messageId, content) => {
  const response = await api.put(`/messages/${messageId}`, { content });
  return response.data.data;
};

export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};
