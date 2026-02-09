import {
  channelEventSchema,
  PresenceSchema,
  presenceSchema,
  userSchema,
} from '@/app/schemas/realtime'
import { Connection, routePartykitRequest, Server } from 'partyserver'
import z from 'zod'

const connectionSchema = z.object({
  user: userSchema.nullable().optional(),
})

type ConnectionState = z.infer<typeof connectionSchema>

// Define your Server
export class Chat extends Server {
  static options = {
    hibernate: true,
  }

  onConnect(connection: Connection) {
    console.log('🚀 Connected', connection.id, 'to server', this.name)

    connection.send(JSON.stringify(this.getPresenceMessage()))
  }

  onClose(connection: Connection) {
    console.log('🚀 Disconnected', connection.id, 'from server', this.name)
    // this.setConnectionState(connection, { user: null })
    this.updateUsers()
  }

  onError(connection: Connection, error: Error) {
    console.log('🚀 Error', connection.id, ':', error)
    this.updateUsers()
  }

  onMessage(connection: Connection, message: string) {
    try {
      const parsedMessage = JSON.parse(message)

      // Try to parse as presence event first
      const validatedPresence = presenceSchema.safeParse(parsedMessage)
      if (validatedPresence.success) {
        const { type, payload } = validatedPresence.data
        switch (type) {
          case 'add-user':
            // store user info on the connection
            this.setConnectionState(connection, { user: payload })
            // Broadcast updated presence to all clients
            this.updateUsers()
            break
          case 'remove-user':
            // remove user
            this.setConnectionState(connection, { user: null })
            this.updateUsers()
            break
          case 'presence':
            // broadcast presence to all connections
            this.updateUsers()
            break
        }
        return // Handled as presence event
      }

      // Try to parse as channel event
      const channelEvent = channelEventSchema.safeParse(parsedMessage)
      if (channelEvent.success) {
        const payload = JSON.stringify(channelEvent.data)
        this.broadcast(payload, [connection.id]) // Don't send back to sender
        return
      }
    } catch (error) {
      console.log('🚀 ~ Chat ~ onMessage ~ error:', error)
    }
  }

  updateUsers() {
    const presenceMessage = JSON.stringify(this.getPresenceMessage())
    this.broadcast(presenceMessage)
  }

  getPresenceMessage() {
    return {
      payload: {
        users: this.getUsers(),
      },
      type: 'presence',
    } satisfies PresenceSchema
  }

  getUsers() {
    const users = new Map()
    for (const connection of this.getConnections()) {
      const state = this.getConnectionState(connection)
      if (!state.user) {
        continue
      }

      users.set(state.user.id, state.user)
    }

    return Array.from(users.values())
  }

  private setConnectionState(connection: Connection, state: ConnectionState) {
    connection.setState(state)
  }

  private getConnectionState(connection: Connection): ConnectionState {
    const result = connectionSchema.safeParse(connection.state)

    if (!result.success) {
      return {
        user: null,
      }
    }

    return result.data
  }
}

export default {
  // Set up your fetch handler to use configured Servers
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response('Not Found', { status: 404 })
    )
  },
} satisfies ExportedHandler<Env>
