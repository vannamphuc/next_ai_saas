import { Hash } from 'lucide-react'
import InviteMember from './member/InviteMember'
import { MemberOverView } from './member/MemberOverView'

interface ChannelHeaderProps {
  channelName: string | undefined
}

export const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  return (
    <header className="flex h-14 min-w-0 items-center justify-between gap-3 border-b border-border bg-background/90 px-3 backdrop-blur-sm md:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Hash aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:block">
            Channel
          </p>
          <h1 className="truncate text-sm font-semibold tracking-tight text-foreground md:text-base">
            {channelName ? `#${channelName}` : 'Channel'}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        <InviteMember />
        <MemberOverView />
      </div>
    </header>
  )
}
