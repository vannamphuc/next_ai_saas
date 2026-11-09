import { SafeContent } from '@/components/rich-text-edior/SafeContent'
import { MessageListItem } from '@/lib/type'
import { getAvatar } from '@/lib/get-avatar'
import Image from 'next/image'
import { ReactionsBar } from '../reaction/ReactionsBar'
import { formatMessageTimestamp } from '../message/MessageItem'

interface ThreadReplyProps {
  messages: MessageListItem
  selectedThreadId: string
}

export const ThreadReply = ({
  messages,
  selectedThreadId,
}: ThreadReplyProps) => {
  return (
    <div className="group flex gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-accent/70">
      <Image
        alt=""
        src={getAvatar(messages.authorAvatar, messages.authorEmail)}
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full border border-border/70 object-cover"
      />

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm font-semibold leading-5">
            {messages.authorName}
          </span>
          <time
            dateTime={new Date(messages.createdAt).toISOString()}
            className="whitespace-nowrap text-xs leading-4 tabular-nums text-muted-foreground"
          >
            {formatMessageTimestamp(messages.createdAt)}
          </time>
        </div>

        <SafeContent
          className="mt-1 text-sm leading-6 wrap-break-word prose dark:prose-invert max-w-none marker:text-primary"
          content={messages.content}
        />

        {messages.imageUrl && (
          <div className="mt-4">
            <Image
              src={messages.imageUrl}
              alt="Message attachment"
              width={512}
              height={512}
              className="rounded-md max-h-[320px] w-auto object-contain"
            />
          </div>
        )}

        <ReactionsBar
          messageId={messages.id}
          reactions={messages.reactions}
          context={{
            type: 'thread',
            threadId: selectedThreadId,
          }}
        />
      </div>
    </div>
  )
}
