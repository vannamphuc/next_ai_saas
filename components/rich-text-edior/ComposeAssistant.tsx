import {
  Message,
  MessageContent,
  MessageResponse,
} from '../ai-elements/message'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Sparkles, X } from 'lucide-react'
import { Activity, useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { useChat } from '@ai-sdk/react'
import { eventIteratorToStream } from '@orpc/client'
import { client } from '@/lib/orpc'
import { useRef } from 'react'

interface ComposeAssistantProps {
  content: string
  onAccept?: (str: string) => void
}

export const ComposeAssistant = ({
  content,
  onAccept,
}: ComposeAssistantProps) => {
  const [open, setOpen] = useState(false)
  const contentRef = useRef(content)

  useEffect(() => {
    contentRef.current = content
  }, [content])

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    clearError,
  } = useChat({
    id: `thread-compose`,
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.compose.generate(
            { content: contentRef.current },
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

  const composeText =
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
      sendMessage({ text: 'Compose' })
    } else {
      stop()
      clearError()
      setMessages([])
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="relative overflow-hidden bg-linear-to-t from-violet-600 to-fuchsia-600 text-white shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring w-fit px-2"
        >
          <span className="flex items-center gap-0.5">
            <Sparkles className="size-4" />
            <span className="text-xs font-medium">Compose</span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[25rem] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex items-center justify-center rounded-sm bg-linear-to-r from-violet-600 to-fuchsia-600 py-1.5 px-3">
              <Sparkles className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                AI Compose (Preview)
              </span>
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
                  sendMessage({ text: 'Compose' })
                }}
                size="icon"
                type="button"
                className="w-fit px-2"
              >
                Try again
              </Button>
            </div>
          ) : composeText ? (
            <Message from="assistant">
              <MessageContent>
                <MessageResponse>{composeText}</MessageResponse>
              </MessageContent>
            </Message>
          ) : status === 'submitted' || status === 'streaming' ? (
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <p className="text-sm text-muted-foreground">
                {messages.length === 0
                  ? 'Generating compose...'
                  : 'Updating compose...'}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Click Compose to generate compose
              </p>
            </div>
          )}
        </div>

        <Activity mode={composeText ? 'visible' : 'hidden'}>
          <div className="flex items-center justify-end gap-2 border-t px-3 py-2 bg-muted/30">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                stop()
                clearError()
                setMessages([])
              }}
            >
              Decline
            </Button>
            <Button
              size="sm"
              type="button"
              disabled={!composeText}
              onClick={() => {
                if (!composeText) return
                onAccept?.(composeText)
                stop()
                clearError()
                setMessages([])
                setOpen(false)
              }}
            >
              Accept
            </Button>
          </div>
        </Activity>
      </PopoverContent>
    </Popover>
  )
}
