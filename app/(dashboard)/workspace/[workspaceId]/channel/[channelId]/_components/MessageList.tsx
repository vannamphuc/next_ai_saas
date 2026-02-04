/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query'
import { MessageItem } from './message/MessageItem'
import { orpc } from '@/lib/orpc'
import { useParams } from 'next/navigation'
import { Activity, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/general/EmptyState'
import { ChevronDown, Loader } from 'lucide-react'

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
        className="h-full overflow-y-auto px-4 flex flex-col space-y-1"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {isEmpty ? (
          <div className="flex h-full pt-4">
            <EmptyState
              title="No messages yet"
              description="Be the first to send a message"
              buttonText="Send a message"
              href="#"
            />
          </div>
        ) : (
          items?.map((message) => {
            return (
              <MessageItem
                key={message.id}
                message={message}
                currentUserId={user.id}
              />
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <Activity mode={isFetchingNextPage ? 'visible' : 'hidden'}>
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-2">
          <div className="flex items-center gap-2 rounded-md bg-linear-to-b from-white/80 to-transparent dark:from-neutral-900/80 backdrop-blur px-3 py-1">
            <Loader className="animate-spin size-4 text-muted-foreground" />
            <span>...</span>
          </div>
        </div>
      </Activity>

      {!isAtBottom && !newMessages && !isFetching && !isFetchingNextPage && (
        <Button
          type="button"
          size="sm"
          className="absolute bottom-4 right-8 z-20 size-10 rounded-full hover:shadow-xl transition-all duration-300 ease-in-out"
          onClick={scrollToBottom}
        >
          <ChevronDown className="size-4" />
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
