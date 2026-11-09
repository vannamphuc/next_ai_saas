'use client'

import { orpc } from '@/lib/orpc'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Building2 } from 'lucide-react'

export const WorkspaceHeader = () => {
  const {
    data: { currentWorkspace },
  } = useSuspenseQuery(orpc.channel.list.queryOptions())

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Building2 aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/65">
          Active workspace
        </p>
        <h2 className="truncate text-sm font-semibold text-sidebar-foreground">
          {currentWorkspace.orgName || 'Workspace'}
        </h2>
      </div>
    </div>
  )
}
