'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'

export function MobileChannelName() {
  const params = useParams<{ channelId?: string }>()
  const channelId = params?.channelId

  const { data } = useQuery(
    orpc.channel.get.queryOptions({
      input: {
        channelId: channelId!,
      },
      enabled: !!channelId,
    }),
  )

  if (!channelId || !data) {
    return <span className="text-sm font-medium">Channels</span>
  }

  return (
    <span className="text-sm font-medium truncate">#{data.channelName}</span>
  )
}
