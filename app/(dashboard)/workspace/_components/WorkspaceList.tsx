'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { orpc } from '@/lib/orpc'
import { cn } from '@/lib/utils'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { useSuspenseQuery } from '@tanstack/react-query'

const colorCombinations = [
  // Blue
  'bg-blue-500 hover:bg-blue-600 text-white',
  'bg-sky-500 hover:bg-sky-600 text-white',
  'bg-indigo-500 hover:bg-indigo-600 text-white',

  // Green
  'bg-green-500 hover:bg-green-600 text-white',
  'bg-emerald-500 hover:bg-emerald-600 text-white',
  'bg-teal-500 hover:bg-teal-600 text-white',

  // Red / Orange
  'bg-red-500 hover:bg-red-600 text-white',
  'bg-rose-500 hover:bg-rose-600 text-white',
  'bg-orange-500 hover:bg-orange-600 text-white',

  // Yellow / Amber
  'bg-amber-400 hover:bg-amber-500 text-black',
  'bg-yellow-400 hover:bg-yellow-500 text-black',

  // Purple / Pink
  'bg-purple-500 hover:bg-purple-600 text-white',
  'bg-violet-500 hover:bg-violet-600 text-white',
  'bg-pink-500 hover:bg-pink-600 text-white',
  'bg-fuchsia-500 hover:bg-fuchsia-600 text-white',

  // Neutral
  'bg-slate-500 hover:bg-slate-600 text-white',
  'bg-gray-700 hover:bg-gray-800 text-white',
  'bg-zinc-800 hover:bg-zinc-900 text-white',

  // Dark
  'bg-black hover:bg-neutral-800 text-white',
]

const getWorkspaceColor = (workspaceId: string) => {
  // Tạo một hàm băm đơn giản từ ID của workspace
  const charSum = workspaceId
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
  // Lấy chỉ số màu dựa trên tổng ký tự băm
  const colorIndex = charSum % colorCombinations.length
  // Trả về tổ hợp màu tương ứng
  return colorCombinations[colorIndex]
}

export const WorkspaceList = ({ showName = false }: { showName?: boolean }) => {
  const {
    data: { workspaces, currentWorkspace },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions())

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-3 w-full">
        {workspaces.map((workspace) => {
          const isActive = workspace.id === currentWorkspace.orgCode
          return (
            <Tooltip key={workspace.id}>
              <TooltipTrigger asChild>
                <LoginLink orgCode={workspace.id} className="w-full">
                  <Button
                    variant={
                      showName ? (isActive ? 'secondary' : 'ghost') : 'default'
                    }
                    className={cn(
                      'transition-all duration-200 w-full justify-start',
                      showName
                        ? 'h-12 px-3 gap-3'
                        : 'size-12 p-0 justify-center',
                      !showName && getWorkspaceColor(workspace.id),
                      showName && isActive && 'bg-accent',
                    )}
                  >
                    <div
                      className={cn(
                        'size-8 shrink-0 rounded-md flex items-center justify-center font-semibold text-sm text-white',
                        getWorkspaceColor(workspace.id),
                      )}
                    >
                      {workspace.avatar}
                    </div>
                    {showName && (
                      <span
                        className={cn(
                          'font-medium truncate flex-1 text-left',
                          isActive
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {workspace.name}
                      </span>
                    )}
                  </Button>
                </LoginLink>
              </TooltipTrigger>
              {!showName && (
                <TooltipContent side="right">
                  {workspace.name}
                  {isActive && ' (Current)'}
                </TooltipContent>
              )}
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
