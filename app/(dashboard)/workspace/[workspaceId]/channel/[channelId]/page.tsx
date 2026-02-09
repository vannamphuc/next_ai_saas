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
    return <div>Error: {error.message}</div>
  }

  return (
    <ChannelRealtimeProvider channelId={channelId}>
      <div className="flex h-full w-full flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 min-w-0 h-full bg-background">
          {/* Fixed Header - Hidden on Mobile */}
          <div className="hidden md:block">
            {isLoading ? (
              <div className="flex items-center justify-between h-14 px-4 border-b">
                <Skeleton className="h-6 w-40" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ) : (
              <ChannelHeader channelName={data?.channelName} />
            )}
          </div>

          {/* Scrollable Messages Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <MessageList />
          </div>

          {/* Fixed Input area - Syncing with Thread input style */}
          <div className="border-t bg-background p-2 md:p-4">
            <div className="max-w-[1200px] mx-auto w-full">
              <MessageInputForm
                channelId={channelId}
                user={data?.currentUser as KindeUser<Record<string, unknown>>}
              />
            </div>
          </div>
        </div>

        <Activity mode={isThreadOpen ? 'visible' : 'hidden'}>
          <ThreadSidebar
            user={data?.currentUser as KindeUser<Record<string, unknown>>}
          />
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
