import { SafeContent } from '@/components/rich-text-edior/SafeContent'
import { MessageListItem } from '@/lib/type'
import Image from 'next/image'
import { ReactionsBar } from '../reaction/ReactionsBar'

interface ThreadReplyProps {
  messages: MessageListItem
  selectedThreadId: string
}

export const ThreadReply = ({
  messages,
  selectedThreadId,
}: ThreadReplyProps) => {
  return (
    <div className="flex space-x-3 p-3 hover:bg-muted/30 rounded-lg">
      <Image
        alt="Author Avatar"
        src={messages.authorAvatar}
        width={32}
        height={32}
        className="size-8 rounded-full shrink-0"
      />

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">{messages.authorName}</span>

          <span className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              month: 'short',
              day: 'numeric',
            }).format(messages.createdAt)}
          </span>
        </div>

        <SafeContent
          className="text-sm wrap-break-word prose dark:prose-invert max-w-none marker:text-primary"
          content={JSON.parse(messages.content)}
        />

        {messages.imageUrl && (
          <div className="mt-4">
            <Image
              src={messages.imageUrl}
              alt="Message Attachment"
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
