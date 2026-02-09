import { useState } from 'react'
import usePartySocket from 'partysocket/react'
import {
  presenceSchema,
  PresenceSchema,
  UserSchema,
} from '@/app/schemas/realtime'

interface usePresennceProps {
  room: string
  currentUser: UserSchema | null
}

export const usePresence = ({ room, currentUser }: usePresennceProps) => {
  const [onlineUsers, setOnlineUsers] = useState<UserSchema[]>([])

  const socket = usePartySocket({
    host: 'http://127.0.0.1:8787',
    room: room,
    party: 'chat',

    onOpen() {
      console.log('🚀 ~ usePresence ~ socket ~ onOpen ~ socket:', socket)
      if (currentUser) {
        const message: PresenceSchema = {
          type: 'add-user',
          payload: currentUser,
        }
        socket.send(JSON.stringify(message))
      }
    },

    onMessage(event) {
      console.log('🚀 ~ usePresence ~ socket ~ onMessage ~ event:', event)
      try {
        const message = JSON.parse(event.data)
        const validatedMessage = presenceSchema.safeParse(message)

        if (!validatedMessage.success) {
          return
        }

        const { type, payload } = validatedMessage.data

        switch (type) {
          case 'presence':
            setOnlineUsers(payload.users)
            break
        }
      } catch (error) {
        console.log('🚀 ~ usePresence ~ error:', error)
      }
    },

    onClose(event) {
      console.log('🚀 ~ usePresence ~ socket ~ onClose ~ event:', event)
    },

    onError(event) {
      console.log('🚀 ~ usePresence ~ socket ~ onError ~ event:', event)
    },
  })

  return {
    onlineUsers,
    socket,
  }
}
