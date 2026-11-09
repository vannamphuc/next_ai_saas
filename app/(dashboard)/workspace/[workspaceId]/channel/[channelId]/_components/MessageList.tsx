/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import {
  getMessageDateKey,
  MessageDateDivider,
  MessageItem,
} from './message/MessageItem'
import { orpc } from '@/lib/orpc'
import { useParams } from 'next/navigation'
import { Activity, Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ChevronDown,
  Loader,
  MessageSquareText,
  PencilLine,
} from 'lucide-react'

const MessageListSkeleton = () => (
  <div role="status" aria-label="Loading messages" className="space-y-5 py-5">
    <span className="sr-only">Loading messages</span>
    {[0, 1, 2, 3, 4].map((row) => (
      <div key={row} aria-hidden="true" className="flex gap-3 px-3 sm:px-4">
        <Skeleton className="size-8 shrink-0 rounded-full motion-reduce:animate-none" />
        <div className="min-w-0 flex-1 space-y-2 pt-0.5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-28 motion-reduce:animate-none" />
            <Skeleton className="h-3 w-14 motion-reduce:animate-none" />
          </div>
          <Skeleton className="h-3.5 w-full motion-reduce:animate-none" />
          <Skeleton className="h-3.5 w-2/3 motion-reduce:animate-none" />
        </div>
      </div>
    ))}
  </div>
)

export const MessageList = () => {
  const { channelId } = useParams<{ channelId: string }>()
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [newMessages, setNewMessages] = useState(false)
  const lastItemIdRef = useRef<string | undefined>(undefined)

  const infiniteOptions = orpc.message.list.infiniteOptions({
    input: (pageParam: string | undefined) => ({
      channelId: channelId,
      cursor: pageParam,
      limit: 30,
    }),
    queryKey: ['messages.list', channelId],
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => ({
      pages: [...data.pages]
        .map((p) => ({ ...p, items: [...p.items].reverse() }))
        .reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  })

  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions())

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isFetching,
  } = useInfiniteQuery({
    ...infiniteOptions,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const items = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? []
  }, [data])

  const isEmpty = !isLoading && !error && items.length === 0

  // scroll to the bottom when messages first load
  useEffect(() => {
    if (!hasInitialScrolled && data?.pages.length) {
      const el = scrollRef.current

      if (el) {
        // el.scrollTop = el.scrollHeight
        bottomRef.current?.scrollIntoView({ block: 'end' })
        setHasInitialScrolled(true)
        setIsAtBottom(true)
      }
    }
  }, [hasInitialScrolled, data?.pages?.length])

  // keep view pinned to bottom on late content growth (e.g: images)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const scrollToBottomIfNeeded = () => {
      if (isAtBottom || !hasInitialScrolled) {
        requestAnimationFrame(() => {
          bottomRef.current?.scrollIntoView({
            block: 'end',
          })
        })
      }
    }

    const onImageLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scrollToBottomIfNeeded()
      }
    }

    el.addEventListener('load', onImageLoad, true)

    // ResizeObserver watches for size changes in the container
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottomIfNeeded()
    })
    resizeObserver.observe(el)

    //MutationObserver watches from DOM changes (e.g: images loading, content updates)
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

  const isNearBottom = (el: HTMLDivElement) =>
    el.scrollHeight - el.scrollTop - el.clientHeight <= 80

  const handleScroll = () => {
    const el = scrollRef.current

    if (!el) return

    if (el.scrollTop <= 80 && hasNextPage && !isFetching) {
      const prevScrollHeight = el.scrollHeight
      const prevScrollTop = el.scrollTop
      fetchNextPage().then(() => {
        const newScrollHeight = el.scrollHeight
        el.scrollTop = newScrollHeight - prevScrollHeight + prevScrollTop
      })
    }

    setIsAtBottom(isNearBottom(el))
  }

  const scrollToBottom = () => {
    const el = scrollRef.current
    if (!el) return

    bottomRef.current?.scrollIntoView({ block: 'end' })
    setNewMessages(false)
    setIsAtBottom(true)
  }

  const focusComposer = () => {
    document
      .querySelector<HTMLElement>(
        '#channel-message-composer [contenteditable="true"]',
      )
      ?.focus()
  }

  useEffect(() => {
    if (!items.length) return
    const lastId = items[items.length - 1].id
    const prevLastId = lastItemIdRef.current
    const el = scrollRef.current

    if (prevLastId && lastId !== prevLastId) {
      if (el && isNearBottom(el)) {
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight
        })

        setNewMessages(false)
        setIsAtBottom(true)
      } else {
        setNewMessages(true)
      }
    }

    lastItemIdRef.current = lastId
  }, [items])

  return (
    <div className="relative h-full">
      <div
        className="flex h-full flex-col space-y-1 overflow-y-auto px-3 sm:px-4"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {isLoading ? (
          <MessageListSkeleton />
        ) : isEmpty ? (
          <div className="flex min-h-full items-center justify-center px-3 py-10">
            <div className="w-full max-w-md rounded-2xl border border-dashed border-border bg-card px-6 py-9 text-center shadow-sm sm:px-8">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquareText aria-hidden="true" className="size-5" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Start the conversation
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                This channel is quiet for now. Share an update or ask a question
                to get things moving.
              </p>
              <Button
                type="button"
                className="mt-6 bg-cta text-cta-foreground hover:bg-cta/90 focus-visible:ring-cta"
                onClick={focusComposer}
              >
                <PencilLine aria-hidden="true" className="size-4" />
                Write the first message
              </Button>
            </div>
          </div>
        ) : (
          items.map((message, index) => {
            const previousMessage = index > 0 ? items[index - 1] : undefined
            const showDateDivider =
              !previousMessage ||
              getMessageDateKey(message.createdAt) !==
                getMessageDateKey(previousMessage.createdAt)

            return (
              <Fragment key={message.id}>
                {showDateDivider && (
                  <MessageDateDivider date={message.createdAt} />
                )}
                <MessageItem message={message} currentUserId={user.id} />
              </Fragment>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <Activity mode={isFetchingNextPage ? 'visible' : 'hidden'}>
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-2">
          <div
            role="status"
            aria-label="Loading earlier messages"
            className="flex items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-lg backdrop-blur"
          >
            <Loader aria-hidden="true" className="size-4 animate-spin" />
            <span>Loading earlier messages</span>
          </div>
        </div>
      </Activity>

      {!isAtBottom && !newMessages && !isFetching && !isFetchingNextPage && (
        <Button
          type="button"
          size="sm"
          aria-label="Scroll to latest message"
          className="absolute bottom-4 right-5 z-20 size-10 rounded-full shadow-md transition-shadow hover:shadow-lg"
          onClick={scrollToBottom}
        >
          <ChevronDown aria-hidden="true" className="size-4" />
        </Button>
      )}

      {newMessages && !isAtBottom ? (
        <Button
          type="button"
          className="absolute bottom-4 right-8 rounded-full z-20"
          onClick={scrollToBottom}
        >
          New Messages
        </Button>
      ) : null}
    </div>
  )
}
