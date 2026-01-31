import { createChannel, listChannel } from './channel'
import { createMessage, listMessages } from './message'
import { createWorkspace, listWorkspace } from './workspace'

export const router = {
  workspace: {
    list: listWorkspace,
    create: createWorkspace,
  },
  channel: {
    create: createChannel,
    list: listChannel,
  },
  message: {
    create: createMessage,
    list: listMessages,
  }
}
