import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useChat } from '@ai-sdk/react'
import { Sparkles, X } from 'lucide-react'
import { eventIteratorToStream } from '@orpc/client'
import { client } from '@/lib/orpc'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'

interface SummaryThreadProps {
  messageId: string
}

export const SummaryThread = ({ messageId }: SummaryThreadProps) => {
  const [open, setOpen] = useState(false)

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    clearError,
  } = useChat({
    id: `thread-summary-${messageId}`,
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.thread.summary.generate(
            {
              messageId: messageId,
            },
            { signal: options.abortSignal },
          ),
        )
      },
      reconnectToStream() {
        throw new Error('Cannot reconnect to stream')
      },
    },
  })

  const lastAssistant = messages.findLast((m) => m.role === 'assistant')

  const summaryText =
    lastAssistant?.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('\n\n') ?? ''

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (open) {
      const hasAssistantMessage = messages.some((m) => m.role === 'assistant')
      if (hasAssistantMessage || status !== 'ready') {
        return
      }
      sendMessage({ text: 'Summarize Thread' })
    } else {
      stop()
      clearError()
      setMessages([])
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button type="button" size="sm" className="w-fit">
          <Sparkles aria-hidden="true" className="size-4" />
          <span className="text-xs font-medium">AI Summary</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[25rem] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center gap-1.5 rounded-sm bg-primary px-3 py-1.5 text-primary-foreground">
              <Sparkles aria-hidden="true" className="size-4" />
              <span className="text-sm font-medium">AI Summary (Preview)</span>
            </span>
          </div>

          {status === 'streaming' && (
            <Button onClick={stop} variant="ghost" size="icon" type="button">
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="px-4 py-3 max-h-80 overflow-y-auto">
          {error ? (
            <div className="flex items-center gap-2">
              <p className="text-red-500 text-sm">{error.message}</p>
              <Button
                onClick={() => {
                  clearError()
                  setMessages([])
                  sendMessage({ text: 'Summarize Thread' })
                }}
                size="icon"
                type="button"
                className="w-fit px-2"
              >
                Try again
              </Button>
            </div>
          ) : summaryText ? (
            <Message from="assistant">
              <MessageContent>
                <MessageResponse>{summaryText}</MessageResponse>
              </MessageContent>
            </Message>
          ) : status === 'submitted' || status === 'streaming' ? (
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <p className="text-sm text-muted-foreground">
                {messages.length === 0
                  ? 'Generating summary...'
                  : 'Updating summary...'}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Click Summary to generate summary
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
