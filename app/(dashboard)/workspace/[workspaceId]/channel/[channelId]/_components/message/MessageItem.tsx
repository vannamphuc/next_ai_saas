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

type MessageDate = Date | string

export const getMessageDateKey = (value: MessageDate) => {
  const date = new Date(value)
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

export const formatMessageTimestamp = (value: MessageDate) =>
  new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))

const formatMessageDateLabel = (value: MessageDate) => {
  const date = new Date(value)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (getMessageDateKey(date) === getMessageDateKey(today)) return 'Today'
  if (getMessageDateKey(date) === getMessageDateKey(yesterday)) {
    return 'Yesterday'
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }

  if (date.getFullYear() !== today.getFullYear()) {
    options.year = 'numeric'
  }

  return new Intl.DateTimeFormat(undefined, options).format(date)
}

export const MessageDateDivider = ({ date }: { date: MessageDate }) => {
  const label = formatMessageDateLabel(date)

  return (
    <div
      role="separator"
      aria-label={label}
      className="flex items-center gap-3 px-3 py-3"
    >
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
      <span className="shrink-0 rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
        {label}
      </span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </div>
  )
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
    <div className="group relative flex gap-3 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-muted/60 sm:px-4">
      <Image
        src={getAvatar(message.authorAvatar, message.authorEmail)}
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full border border-border/70 object-cover"
      />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-sm font-semibold leading-5 text-foreground">
            {message.authorName}
          </p>
          <time
            dateTime={new Date(message.createdAt).toISOString()}
            className="whitespace-nowrap text-xs leading-4 tabular-nums text-muted-foreground"
          >
            {formatMessageTimestamp(message.createdAt)}
          </time>
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
              className="mt-1 text-sm leading-6 wrap-break-word prose dark:prose-invert max-w-none marker:text-primary"
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
                className="mt-1 inline-flex min-h-9 items-center gap-1.5 rounded-md text-xs font-medium text-primary-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onMouseEnter={prefetchThread}
                onFocus={prefetchThread}
              >
                <MessageSquareMore aria-hidden="true" className="size-3.5" />
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
