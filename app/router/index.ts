import { createChannel, getChannel, listChannel } from './channel'
import { inviteMember, listMember } from './member'
import {
  createMessage,
  listMessages,
  listThreadMessages,
  updateMessage,
} from './message'
import { createWorkspace, listWorkspace } from './workspace'

export const router = {
  workspace: {
    list: listWorkspace,
    create: createWorkspace,
    member: {
      invite: inviteMember,
      list: listMember,
    },
  },
  channel: {
    create: createChannel,
    list: listChannel,
    get: getChannel,
  },
  message: {
    create: createMessage,
    list: listMessages,
    update: updateMessage,
    thread: {
      list: listThreadMessages,
    },
  },
}
