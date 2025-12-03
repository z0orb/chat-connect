import { useEffect, useState } from 'react'
import Ably from 'ably'

export const useAbly = (channelName) => {
  const [channel, setChannel] = useState(null)

  useEffect(() => {
    if (!channelName) {
      setChannel(null)
      return
    }

    const ablyClient = new Ably.Realtime(import.meta.env.VITE_ABLY_API_KEY)
    const ablyChannel = ablyClient.channels.get(channelName)

    setChannel(ablyChannel)

    // Proper cleanup function
    return () => {
      ablyChannel.unsubscribe()
      ablyClient.close()
    }
  }, [channelName])

  return channel
}
