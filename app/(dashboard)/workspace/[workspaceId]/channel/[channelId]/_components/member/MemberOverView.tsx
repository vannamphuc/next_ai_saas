'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { orpc } from '@/lib/orpc'
import { useQuery } from '@tanstack/react-query'
import { Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MemberItem } from './MemberItem'
import { Skeleton } from '@/components/ui/skeleton'
import { usePresence } from '@/hooks/use-presence'
import { useParams } from 'next/navigation'
import { UserSchema } from '@/app/schemas/realtime'

export const MemberOverView = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data, isLoading, error } = useQuery(
    orpc.workspace.member.list.queryOptions(),
  )
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

  const query = search.trim().toLowerCase()

  const filteredMembers = useMemo(() => {
    const members = data ?? []
    if (!query) return members
    return members.filter((member) => {
      return (
        member.full_name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
      )
    })
  }, [data, query])

  const { onlineUsers } = usePresence({
    room: `workspace-${workspaceId}`,
    currentUser: currentUser,
  })

  const onlineUserIds = useMemo(() => {
    return new Set(onlineUsers.map((user) => user.id))
  }, [onlineUsers])

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Users />
          Member
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="p-0 w-[425px]">
        <div className="p-0">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Workspace Members</h3>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>

          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Members */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="px-4 py-2 flex items-center gap-3">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                  </div>
                </div>
              ))
            ) : filteredMembers.length === 0 ? (
              <p className="px-4 py-6 text-muted-foreground">
                No members found
              </p>
            ) : (
              filteredMembers.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  online={member.id ? onlineUserIds.has(member.id) : false}
                />
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
