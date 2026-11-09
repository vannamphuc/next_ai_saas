'use client'

import { Building2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useSuspenseQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'

export function WorkspaceNameLabel() {
  const params = useParams<{ workspaceId?: string }>()
  const {
    data: { workspaces, currentWorkspace },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions())

  const activeWorkspace = params.workspaceId
    ? workspaces.find((workspace) => workspace.id === params.workspaceId)
    : undefined
  const workspaceName = params.workspaceId
    ? activeWorkspace?.name ?? currentWorkspace?.orgName ?? 'Workspace'
    : 'Workspaces'

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Building2 aria-hidden="true" className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {params.workspaceId ? 'Current workspace' : 'Team spaces'}
        </p>
        <p className="truncate text-sm font-semibold text-foreground">
          {workspaceName}
        </p>
      </div>
    </div>
  )
}
