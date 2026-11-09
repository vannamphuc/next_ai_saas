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
import { Fragment } from 'react'
import { getAvatar } from '@/lib/get-avatar'
import {
  formatMessageTimestamp,
  getMessageDateKey,
  MessageDateDivider,
} from '../message/MessageItem'

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

  const threadContent = (
    <ThreadRealtimeProvider threadId={threadId}>
      <div className="flex h-full w-full flex-col border-l border-border bg-background xl:w-lg">
        <div className="flex h-14 items-center justify-between border-b border-border px-3 md:px-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare aria-hidden="true" className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight md:text-base">
              Thread
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SummaryThread messageId={threadId} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Close thread"
              onClick={closeThread}
            >
              <X aria-hidden="true" className="size-4" />
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
              <div role="status" aria-label="Loading thread">
                <span className="sr-only">Loading thread</span>
                <ThreadSkeleton />
              </div>
            ) : data ? (
              <>
                <MessageDateDivider date={data.parent.createdAt} />
                <div className="border-b border-border bg-card/70 p-3 md:p-4">
                  <div className="flex gap-3">
                    <Image
                      src={getAvatar(
                        data.parent.authorAvatar,
                        data.parent.authorEmail,
                      )}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 shrink-0 rounded-full border border-border/70 object-cover"
                    />

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold leading-5">
                          {data.parent.authorName}
                        </span>

                        <time
                          dateTime={new Date(
                            data.parent.createdAt,
                          ).toISOString()}
                          className="whitespace-nowrap text-xs leading-4 tabular-nums text-muted-foreground"
                        >
                          {formatMessageTimestamp(data.parent.createdAt)}
                        </time>
                      </div>

                      <SafeContent
                        className="mt-1 text-sm leading-6 wrap-break-word prose dark:prose-invert max-w-none marker:text-primary"
                        content={data.parent.content}
                      />
                    </div>
                  </div>
                </div>

                {/* Thread Replies */}
                <div className="p-3 md:p-4">
                  <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {data.messages.length} replies
                  </p>

                  <div className="space-y-1">
                    {data.messages.map((message, index) => {
                      const previousDate =
                        index === 0
                          ? data.parent.createdAt
                          : (data.messages[index - 1]?.createdAt ??
                            data.parent.createdAt)
                      const showDateDivider =
                        getMessageDateKey(message.createdAt) !==
                        getMessageDateKey(previousDate)

                      return (
                        <Fragment key={message.id}>
                          {showDateDivider && (
                            <MessageDateDivider date={message.createdAt} />
                          )}
                          <ThreadReply
                            messages={message}
                            selectedThreadId={threadId}
                          />
                        </Fragment>
                      )
                    })}
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
              aria-label="Scroll to latest reply"
              className="absolute bottom-4 right-5 z-20 size-10 rounded-full shadow-md transition-shadow hover:shadow-lg"
              onClick={() =>
                bottomRef.current?.scrollIntoView({ block: 'end' })
              }
            >
              <ArrowDown aria-hidden="true" className="size-4" />
            </Button>
          )}
        </div>

        {/* Thread reply form */}
        <div className="border-t border-border bg-background p-3 md:p-4">
          <ThreadReplyForm threadId={threadId} user={user} />
        </div>
      </div>
    </ThreadRealtimeProvider>
  )

  return (
    <>
      {/* Desktop Thread Sidebar */}
      <div className="hidden xl:block">{threadContent}</div>

      {/* Mobile, tablet, and compact desktop thread - Full Screen Overlay */}
      <div className="fixed inset-0 z-50 bg-background xl:hidden">
        {threadContent}
      </div>
    </>
  )
}
