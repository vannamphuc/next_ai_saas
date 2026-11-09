'use client'

import { useQuery } from '@tanstack/react-query'
import { ChannelHeader } from './_components/ChannelHeader'
import { MessageList } from './_components/MessageList'
import { MessageInputForm } from './_components/message/MessageInputForm'
import { useParams } from 'next/navigation'
import { orpc } from '@/lib/orpc'
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs'
import { Skeleton } from '@/components/ui/skeleton'
import { ThreadSidebar } from './_components/thread/ThreadSidebar'
import { ThreadProvider, useThread } from '@/providers/ThreadProvider'
import { Activity } from 'react'
import { ChannelRealtimeProvider } from '@/providers/ChannelRealtimeProvider'

const ChannelPageMain = () => {
  const { channelId } = useParams<{ channelId: string }>()
  const { isThreadOpen } = useThread()
  const { data, error, isLoading } = useQuery(
    orpc.channel.get.queryOptions({
      input: {
        channelId: channelId,
      },
    }),
  )

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-card px-6 py-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Couldn&rsquo;t load this channel
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {error.message ||
              'Something went wrong while loading the channel. Please try again.'}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading || !data?.currentUser) {
    return (
      <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <div
          role="status"
          aria-label="Loading channel"
          className="hidden h-14 items-center justify-between border-b border-border px-4 md:flex"
        >
          <span className="sr-only">Loading channel</span>
          <Skeleton className="h-6 w-40 motion-reduce:animate-none" />
          <div className="flex items-center gap-2" aria-hidden="true">
            <Skeleton className="h-8 w-28 motion-reduce:animate-none" />
            <Skeleton className="h-8 w-20 motion-reduce:animate-none" />
            <Skeleton className="size-8 motion-reduce:animate-none" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            Loading channel&hellip;
          </p>
        </div>
      </div>
    )
  }

  const currentUser = data.currentUser as KindeUser<Record<string, unknown>>

  return (
    <ChannelRealtimeProvider channelId={channelId}>
      <div className="flex h-full w-full flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 min-w-0 h-full bg-background">
          {/* Fixed Header - Hidden on Mobile */}
          <div className="hidden md:block">
            <ChannelHeader channelName={data.channelName} />
          </div>

          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <MessageList />
          </div>

          {/* Fixed Input area - Syncing with Thread input style */}
          <div className="border-t bg-background p-2 md:p-4">
            <div className="max-w-[1200px] mx-auto w-full">
              <MessageInputForm channelId={channelId} user={currentUser} />
            </div>
          </div>
        </div>

        <Activity mode={isThreadOpen ? 'visible' : 'hidden'}>
          <ThreadSidebar user={currentUser} />
        </Activity>
      </div>
    </ChannelRealtimeProvider>
  )
}

const EChannelPage = () => {
  return (
    <ThreadProvider>
      <ChannelPageMain />
    </ThreadProvider>
  )
}

export default EChannelPage
