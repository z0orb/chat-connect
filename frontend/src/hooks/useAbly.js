import { createContext, useContext, useEffect, useState, createElement } from 'react'
import Ably from 'ably'

const AblyContext = createContext(null)

export function AblyProvider({ children }) {
  const [client, setClient] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_ABLY_API_KEY
    
    if (!apiKey) {
      console.error('VITE_ABLY_API_KEY is missing')
      return
    }

    const ablyClient = new Ably.Realtime(apiKey)
    
    ablyClient.connection.on('connected', () => {
      console.log('Ably connected')
    })

    ablyClient.connection.on('failed', (error) => {
      console.error('Ably failed:', error)
    })

    setClient(ablyClient)

    return () => {
      ablyClient.close()
    }
  }, [])

  return createElement(AblyContext.Provider, { value: client }, children)
}

export function useAbly() {
  return useContext(AblyContext)
}
