'use client'

import { SafeContent } from '@/components/rich-text-edior/SafeContent'
import { getAvatar } from '@/lib/get-avatar'
import Image from 'next/image'
import { MessageHoverToolbar } from '../toolbar'
import { useCallback, useState } from 'react'
import { EditMessage } from '../toolbar/EditMessage'
import { MessageListItem } from '@/lib/type'
import { MessageSquareMore } from 'lucide-react'
import { useThread } from '@/providers/ThreadProvider'
import { orpc } from '@/lib/orpc'
import { useQueryClient } from '@tanstack/react-query'
import { ReactionsBar } from '../reaction/ReactionsBar'

interface IAppProps {
  message: MessageListItem
  currentUserId: string
}

export const MessageItem = ({ message, currentUserId }: IAppProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const { openThread } = useThread()
  const queryClient = useQueryClient()

  const prefetchThread = useCallback(() => {
    const options = orpc.message.thread.list.queryOptions({
      input: {
        messageId: message.id,
      },
    })
    queryClient
      .prefetchQuery({
        ...options,
        staleTime: 60_000,
      })
      .catch(() => {
        console.log('Failed to prefetch thread')
      })
  }, [message.id, queryClient])

  return (
    <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
      <Image
        src={getAvatar(message.authorAvatar, message.authorEmail)}
        alt="User Avatar"
        width={32}
        height={32}
        className="size-8 rounded-lg"
      />

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-x-2">
          <p className="font-medium leading-none">{message.authorName}</p>
          <p className="text-xs text-muted-foreground leading-none">
            {new Intl.DateTimeFormat('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }).format(message.createdAt)}{' '}
            {new Intl.DateTimeFormat('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            }).format(message.createdAt)}
          </p>
        </div>

        {isEditing ? (
          <EditMessage
            message={message}
            onCancel={() => setIsEditing(false)}
            onSave={() => setIsEditing(false)}
          />
        ) : (
          <>
            <SafeContent
              className="text-sm wrap-break-word prose dark:prose-invert max-w-none marker:text-primary"
              content={JSON.parse(message.content)}
            />

            {message.imageUrl && (
              <div className="mt-4">
                <Image
                  src={message.imageUrl}
                  alt="Message Attachment"
                  width={512}
                  height={512}
                  className="rounded-md max-h-[320px] w-auto object-contain"
                />
              </div>
            )}

            {/* Reactions */}
            <ReactionsBar
              messageId={message.id}
              reactions={message.reactions}
              context={{
                type: 'list',
                channelId: message.channelId!,
              }}
            />

            {message.repliesCount > 0 && (
              <button
                type="button"
                onClick={() => openThread(message.id)}
                className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border"
                onMouseEnter={prefetchThread}
                onFocus={prefetchThread}
              >
                <MessageSquareMore className="size-3" />
                {message.repliesCount} replies
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  View replies
                </span>
              </button>
            )}
          </>
        )}
      </div>
      <MessageHoverToolbar
        messageId={message.id}
        onEdit={() => setIsEditing(true)}
        canEdit={message.authorId === currentUserId}
      />
    </div>
  )
}
