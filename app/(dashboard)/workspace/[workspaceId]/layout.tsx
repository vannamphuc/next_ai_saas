import React from 'react'
import { WorkspaceHeader } from './_components/WorkspaceHeader'
import { CreateNewChannel } from './_components/CreateNewChannel'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { ChannelList } from './_components/ChannelList'
import { WorkspaceMemberList } from './_components/WorkspaceMemberList'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/lib/orpc'
import { MobileChannelSidebar } from '@/components/MobileChannelSidebar'
import { MobileChannelName } from './_components/MobileChannelName'

const ChannelListLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(orpc.channel.list.queryOptions())

  const channelSidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center px-4 h-14 border-b border-border">
        <HydrateClient client={queryClient}>
          <WorkspaceHeader />
        </HydrateClient>
      </div>

      <div className="px-4 py-2">
        <CreateNewChannel />
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto px-4">
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground [&[data-state=open]>svg]:rotate-180">
            Main
            <ChevronDown className="size-4 transition-transform duration-200" />
          </CollapsibleTrigger>

          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <HydrateClient client={queryClient}>
              <ChannelList />
            </HydrateClient>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Members List */}
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground [&[data-state=open]>svg]:rotate-180 px-4 py-2 border border-border">
          Members
          <ChevronDown className="size-4 transition-transform duration-200" />
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <HydrateClient client={queryClient}>
            <WorkspaceMemberList />
          </HydrateClient>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* Desktop Channel Sidebar */}
      <div className="hidden md:flex h-full w-70 flex-col bg-secondary/50 border-r border-border shrink-0">
        {channelSidebarContent}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Channel Header Bar - Sticky below the workspace header */}
        <div className="md:hidden sticky top-0 z-40 h-14 shrink-0 flex items-center gap-2 px-3 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <MobileChannelSidebar>
            <div className="flex h-full flex-col bg-card">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Channels</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {channelSidebarContent}
              </div>
            </div>
          </MobileChannelSidebar>
          <div className="flex-1 min-w-0">
            <MobileChannelName />
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">{children}</div>
      </div>
    </div>
  )
}

export default ChannelListLayout
