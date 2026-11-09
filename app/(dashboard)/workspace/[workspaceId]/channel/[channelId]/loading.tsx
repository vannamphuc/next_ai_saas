import { Skeleton } from '@/components/ui/skeleton'

export default function ChannelLoading() {
  return (
    <main
      role="status"
      aria-label="Loading channel"
      className="flex h-full min-h-0 flex-col bg-background"
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-lg motion-reduce:animate-none" />
          <Skeleton className="h-5 w-36 motion-reduce:animate-none" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-8 rounded-lg motion-reduce:animate-none" />
          <Skeleton className="size-8 rounded-lg motion-reduce:animate-none" />
        </div>
      </header>

      <div className="flex flex-1 flex-col justify-end gap-5 overflow-hidden p-4 md:p-8">
        <Skeleton className="h-16 w-2/3 self-start rounded-2xl motion-reduce:animate-none" />
        <Skeleton className="h-20 w-3/4 self-end rounded-2xl motion-reduce:animate-none" />
        <Skeleton className="h-14 w-1/2 self-start rounded-2xl motion-reduce:animate-none" />
        <Skeleton className="h-24 w-full rounded-xl motion-reduce:animate-none" />
      </div>
    </main>
  )
}
