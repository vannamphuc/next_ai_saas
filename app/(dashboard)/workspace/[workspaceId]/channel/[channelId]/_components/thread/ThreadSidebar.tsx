import { Button } from '@/components/ui/button'
import { ArrowDown, MessageSquare, X } from 'lucide-react'
import Image from 'next/image'
import { ThreadReply } from './ThreadReply'
import { ThreadReplyForm } from './ThreadReplyForm'
import { useThread } from '@/providers/ThreadProvider'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'
import { SafeContent } from '@/components/rich-text-edior/SafeContent'
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ThreadSkeleton } from './ThreadSkeleton'
import { SummaryThread } from './SummaryThread'
import { ThreadRealtimeProvider } from '@/providers/ThreadRealtimeProvider'

interface ThreadSidebarProps {
  user: KindeUser<Record<string, unknown>>
}

export const ThreadSidebar = ({ user }: ThreadSidebarProps) => {
  const { threadId, closeThread } = useThread()
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const lastItemIdRef = useRef<string | undefined>(undefined)

  const { data, isLoading } = useQuery(
    orpc.message.thread.list.queryOptions({
      input: {
        messageId: threadId!,
      },
      enabled: !!threadId,
    }),
  )

  const items = useMemo(() => {
    return data?.messages ?? []
  }, [data?.messages])

  // Scroll to bottom when thread first loads
  useEffect(() => {
    if (!hasInitialScrolled && data) {
      const el = scrollRef.current
      if (el) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ block: 'end' })
          setHasInitialScrolled(true)
          setIsAtBottom(true)
        })
      }
    }
  }, [hasInitialScrolled, data])

  // Keep view pinned to bottom on content growth (e.g: images)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom || !hasInitialScrolled) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({ block: 'end' })
        })
      }
    }

    const onImageLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scrollToBottomIfNeeded()
      }
    }

    el.addEventListener('load', onImageLoad, true)

    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded()
    })
    resizeObserver.observe(el)

    const mutationObserver = new MutationObserver(() => {
      scrollToBottomIfNeeded()
    })
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    })

    return () => {
      resizeObserver.disconnect()
      el.removeEventListener('load', onImageLoad, true)
      mutationObserver.disconnect()
    }
  }, [hasInitialScrolled, isAtBottom])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!items.length) return
    const lastId = items[items.length - 1]?.id
    const prevLastId = lastItemIdRef.current
    const el = scrollRef.current

    if (prevLastId && lastId !== prevLastId) {
      if (el && isAtBottom) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight
        })
      }
    }

    lastItemIdRef.current = lastId
  }, [items, isAtBottom])

  const isNearBottom = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setIsAtBottom(isNearBottom(el))
  }

  if (!threadId) return null

  return (
    <ThreadRealtimeProvider threadId={threadId}>
      <div className="w-[32rem] border-l flex flex-col h-full">
        <div className="border-b h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            <span>Thread</span>
          </div>

          <div className="flex items-center gap-2">
            <SummaryThread messageId={threadId} />
            <Button variant="outline" size="icon" onClick={closeThread}>
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto"
          >
            {isLoading ? (
              <ThreadSkeleton />
            ) : data ? (
              <>
                <div className="p-4 border-b bg-muted/20">
                  <div className="flex space-x-2">
                    <Image
                      src={data.parent.authorAvatar}
                      alt={data.parent.authorName}
                      width={32}
                      height={32}
                      className="size-8 rounded-full shrink-0"
                    />

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {data.parent.authorName}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                            month: 'short',
                            day: 'numeric',
                          }).format(data.parent.createdAt)}
                        </span>
                      </div>

                      <SafeContent
                        className="text-sm wrap-break-word prose dark:prose-invert max-w-none marker:text-primary"
                        content={JSON.parse(data.parent.content)}
                      />
                    </div>
                  </div>
                </div>

                {/* Thread Replies */}
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-3 px-2">
                    {data.messages.length} replies
                  </p>

                  <div className="space-y-1">
                    {data.messages.map((message) => (
                      <ThreadReply
                        key={message.id}
                        messages={message}
                        selectedThreadId={threadId}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            <div ref={bottomRef} />
          </div>

          {/* Scroll to bottom button */}
          {!isAtBottom && (
            <Button
              type="button"
              size="sm"
              className="absolute bottom-4 right-5 z-20 size-10 rounded-full hover:shadow-xl transition-all duration-200"
              onClick={() =>
                bottomRef.current?.scrollIntoView({ block: 'end' })
              }
            >
              <ArrowDown className="size-4" />
            </Button>
          )}
        </div>

        {/* Thread reply form */}
        <div className="border-t p-4">
          <ThreadReplyForm threadId={threadId} user={user} />
        </div>
      </div>
    </ThreadRealtimeProvider>
  )
}
