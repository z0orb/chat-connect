import * as Ably from 'ably'

const API_KEY = import.meta.env.VITE_ABLY_API_KEY

if (!API_KEY) {
  console.warn('Warning: VITE_ABLY_API_KEY is not set in .env file')
}

export const realtime = new Ably.Realtime({
  key: API_KEY,
  autoConnect: true,
})

export function subscribeToRoom(roomId, onMessage) {
  const channel = realtime.channels.get(`rooms:${roomId}`)
  
  channel.subscribe((message) => {
    onMessage(message)
  })

  return () => {
    channel.unsubscribe()
  }
}

export function publishEvent(roomId, eventName, data) {
  const channel = realtime.channels.get(`rooms:${roomId}`)
  channel.publish(eventName, data)
}

export function getChannelPresence(roomId) {
  return realtime.channels.get(`rooms:${roomId}`).presence
}
