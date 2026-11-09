import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading workspace"
      className="flex h-dvh w-full overflow-hidden bg-background"
    >
      <aside className="hidden w-16 shrink-0 flex-col items-center gap-3 border-r border-sidebar-border bg-sidebar p-3 md:flex">
        <Skeleton className="size-10 rounded-xl motion-reduce:animate-none" />
        <Skeleton className="size-10 rounded-xl motion-reduce:animate-none" />
        <Skeleton className="size-10 rounded-xl motion-reduce:animate-none" />
        <Skeleton className="mt-auto size-10 rounded-xl motion-reduce:animate-none" />
      </aside>

      <aside className="hidden w-70 shrink-0 flex-col gap-5 border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <Skeleton className="h-10 w-40 motion-reduce:animate-none" />
        <Skeleton className="h-9 w-full motion-reduce:animate-none" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-7 w-full motion-reduce:animate-none" />
          <Skeleton className="h-7 w-11/12 motion-reduce:animate-none" />
          <Skeleton className="h-7 w-10/12 motion-reduce:animate-none" />
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <Skeleton className="h-6 w-36 motion-reduce:animate-none" />
          <div className="flex gap-2">
            <Skeleton className="size-9 rounded-lg motion-reduce:animate-none" />
            <Skeleton className="size-9 rounded-lg motion-reduce:animate-none" />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-6 overflow-hidden p-4 md:p-8">
          <Skeleton className="h-16 w-2/3 self-start rounded-2xl motion-reduce:animate-none" />
          <Skeleton className="h-20 w-3/4 self-end rounded-2xl motion-reduce:animate-none" />
          <Skeleton className="h-14 w-1/2 self-start rounded-2xl motion-reduce:animate-none" />
          <Skeleton className="h-24 w-full rounded-xl motion-reduce:animate-none" />
        </div>
      </main>
    </div>
  )
}
