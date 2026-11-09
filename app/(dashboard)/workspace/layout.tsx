import React from 'react'
import { WorkspaceList } from './_components/WorkspaceList'
import { CreateWorkspace } from './_components/CreateWorkspace'
import { UserNav } from './_components/UserNav'
import { orpc } from '@/lib/orpc'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { MobileSidebar } from '@/components/MobileSidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { WorkspaceNameLabel } from './_components/WorkspaceNameLabel'

const WorkspaceLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions())

  const sidebarContent = (showName = false) => (
    <>
      <HydrateClient client={queryClient}>
        <WorkspaceList showName={showName} />
      </HydrateClient>

      <div className="mt-4 w-full">
        <CreateWorkspace />
      </div>

      <div className="mt-auto flex w-full flex-col items-center gap-2">
        {!showName && <ThemeToggle />}
        <div className="w-full">
          <HydrateClient client={queryClient}>
            <UserNav />
          </HydrateClient>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-16 shrink-0 flex-col items-center border-r border-sidebar-border bg-sidebar px-2 py-3 text-sidebar-foreground">
        {sidebarContent(false)}
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header Bar - Fixed height, always on top */}
        <div className="md:hidden sticky top-0 z-40 h-14 shrink-0 flex items-center gap-2 px-3 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <MobileSidebar side="left">
            <div className="flex h-full w-full flex-col items-center bg-card p-4">
              <div className="w-full mb-6">
                <h2 className="text-lg font-bold px-2">Workspaces</h2>
              </div>
              {sidebarContent(true)}
            </div>
          </MobileSidebar>
          <HydrateClient client={queryClient}>
            <WorkspaceNameLabel />
          </HydrateClient>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export default WorkspaceLayout
