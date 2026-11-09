'use client'

import {
  MessagesSquare,
  MessageSquareReply,
  Sparkles,
  TextCursorInput,
  SmilePlus,
  UsersRound,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import MagicBento, {
  type MagicBentoItem,
} from '@/components/reactbits/MagicBento'

const features: MagicBentoItem[] = [
  {
    id: 'realtime-messaging',
    label: 'REALTIME',
    title: 'Realtime messaging',
    description:
      'Messages sync in under 50ms with infinite scroll and smart unread dividers.',
    icon: <MessagesSquare aria-hidden="true" className="size-4" />,
  },
  {
    id: 'threads',
    label: 'THREADS',
    title: 'Threads',
    description:
      'Reply in context without flooding the channel. Open as sidebar on desktop, overlay on mobile.',
    icon: <MessageSquareReply aria-hidden="true" className="size-4" />,
  },
  {
    id: 'ai-summaries',
    label: 'AI',
    title: 'AI summaries',
    description:
      'One-click TL;DR for long threads. Stay in sync without reading 200 messages.',
    icon: <Sparkles aria-hidden="true" className="size-4" />,
  },
  {
    id: 'rich-editor',
    label: 'COMPOSER',
    title: 'Rich editor',
    description:
      'Tiptap-powered composer with mentions, code blocks and image uploads.',
    icon: <TextCursorInput aria-hidden="true" className="size-4" />,
  },
  {
    id: 'reactions',
    label: 'REACTIONS',
    title: 'Reactions',
    description: 'Emoji reactions with live counts. Hover to see who reacted.',
    icon: <SmilePlus aria-hidden="true" className="size-4" />,
  },
  {
    id: 'members',
    label: 'MEMBERS',
    title: 'Invite & members',
    description: 'Invite by link, manage roles, see presence at a glance.',
    icon: <UsersRound aria-hidden="true" className="size-4" />,
  },
]

export default function FeaturesSection() {
  const { resolvedTheme } = useTheme()

  return (
    <section
      id="features"
      className="mx-auto max-w-7xl scroll-mt-20 px-6 py-16 md:py-24"
    >
      <div className="mb-10 max-w-2xl md:mb-12">
        <p className="text-sm font-semibold tracking-[0.16em] text-primary">
          BUILT FOR PRODUCT TEAMS
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Every conversation, in sync
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          Keep decisions, context and the people doing the work together in one
          calm workspace.
        </p>
      </div>

      <MagicBento
        items={features}
        columns={4}
        rowHeight={200}
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        glowColor="199, 106, 26"
        enableSpotlight={true}
        enableBorderGlow={true}
        enableStars={false}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={true}
        textAutoHide={true}
      />
    </section>
  )
}
