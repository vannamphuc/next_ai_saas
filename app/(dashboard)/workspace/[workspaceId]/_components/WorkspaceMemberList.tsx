'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getAvatar } from '@/lib/get-avatar'
import { orpc } from '@/lib/orpc'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { usePresence } from '@/hooks/use-presence'
import { useParams } from 'next/navigation'
import { useMemo } from 'react'
import { UserSchema } from '@/app/schemas/realtime'
import { cn } from '@/lib/utils'

export const WorkspaceMemberList = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data } = useQuery(orpc.workspace.member.list.queryOptions())
  const { data: workspaceData } = useQuery(orpc.workspace.list.queryOptions())

  const currentUser = useMemo(() => {
    if (!workspaceData?.user) {
      return null
    }

    return {
      id: workspaceData.user.id,
      email: workspaceData.user.email,
      full_name: workspaceData.user.given_name ?? workspaceData.user.email!,
      picture: workspaceData.user.picture,
    } satisfies UserSchema
  }, [workspaceData])

  const { onlineUsers } = usePresence({
    room: `workspace-${workspaceId}`,
    currentUser: currentUser,
  })

  const onlineUserIds = useMemo(() => {
    return new Set(onlineUsers.map((user) => user.id))
  }, [onlineUsers])

  return (
    <div className="max-h-80 overflow-y-auto px-4 py-2 border border-border">
      {data?.map((member) => (
        <div
          key={member.id}
          className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors flex items-center space-x-3"
        >
          <div className="relative">
            <Avatar className="size-8 relative">
              <Image
                width={32}
                height={32}
                src={getAvatar(member?.picture ?? null, member.email!)}
                alt="User Avatar"
                className="object-cover"
              />
              <AvatarFallback>
                {member.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Online / Offline status indicator */}
            <div
              className={cn(
                'absolute bottom-0 right-0 size-2 rounded-full border border-background',
                member.id && onlineUserIds.has(member.id)
                  ? 'bg-green-500'
                  : 'bg-gray-400',
              )}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {member.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
