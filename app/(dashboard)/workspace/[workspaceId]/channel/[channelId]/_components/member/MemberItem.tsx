import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getAvatar } from '@/lib/get-avatar'
import { cn } from '@/lib/utils'
import { organization_user } from '@kinde/management-api-js'
import Image from 'next/image'
import { Activity } from 'react'

interface MemberItemProps {
  member: organization_user
  online?: boolean
}

export const MemberItem = ({ member, online }: MemberItemProps) => {
  const isAdmin = member.roles?.includes('admin')

  return (
    <div className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="size-8">
            <Image
              src={getAvatar(member.picture ?? null, member.email!)}
              alt="Member Avatar"
              fill
              className="object-cover"
            />
            <AvatarFallback>{member.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>

          {/* Online / Offline status indicator */}
          <div
            className={cn(
              'absolute bottom-0 right-0 size-2 rounded-full border border-background',
              online ? 'bg-green-500' : 'bg-gray-400',
            )}
          />
        </div>

        {/* Member Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm truncate font-medium">{member.full_name}</p>
            <span
              className={cn(
                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                isAdmin
                  ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30'
                  : 'bg-blue-50 text-blue-600 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30',
              )}
            >
              {isAdmin ? 'Admin' : 'Member'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {member.email}
          </p>
        </div>
      </div>
    </div>
  )
}
