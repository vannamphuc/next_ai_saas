import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { client } from '@/lib/orpc'
import { Folder } from 'lucide-react'
import { redirect } from 'next/navigation'
import { CreateNewChannel } from './_components/CreateNewChannel'

interface IAppProps {
  params: Promise<{ workspaceId: string }>
}

const WorkspaceIdPage = async ({ params }: IAppProps) => {
  const { workspaceId } = await params
  const { channels } = await client.channel.list()

  if (channels.length > 0) {
    return redirect(`/workspace/${workspaceId}/channel/${channels[0].id}`)
  }

  return (
    <div className="p-5 flex flex-1">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Folder />
          </EmptyMedia>
          <EmptyTitle>No Channels Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any channels yet. Get started by creating
            your first channel.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="max-w-xs">
          <CreateNewChannel />
        </EmptyContent>
      </Empty>
    </div>
  )
}

export default WorkspaceIdPage
