import { ThemeToggle } from '@/components/ui/theme-toggle'
import InviteMember from './member/InviteMember'
import { MemberOverView } from './member/MemberOverView'

interface ChannelHeaderProps {
  channelName: string | undefined
}

export const ChannelHeader = ({ channelName }: ChannelHeaderProps) => {
  return (
    <div className="flex items-center justify-between h-14 px-2 md:px-4 border-b">
      <h1 className="text-base md:text-lg font-semibold truncate">
        #{channelName}
      </h1>

      <div className="flex items-center space-x-2 md:space-x-3">
        <InviteMember />
        <MemberOverView />
        <ThemeToggle />
      </div>
    </div>
  )
}
