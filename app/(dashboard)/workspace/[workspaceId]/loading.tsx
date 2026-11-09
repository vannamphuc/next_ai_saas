import { Skeleton } from '@/components/ui/skeleton'

export default function WorkspaceLoading() {
  return (
    <div
      role="status"
      aria-label="Loading workspace"
      className="flex h-full min-h-0 flex-1 overflow-hidden bg-background"
    >
      <aside className="hidden w-70 shrink-0 flex-col gap-4 border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <Skeleton className="h-10 w-40 motion-reduce:animate-none" />
        <Skeleton className="h-9 w-full motion-reduce:animate-none" />
        <Skeleton className="h-7 w-full motion-reduce:animate-none" />
        <Skeleton className="h-7 w-10/12 motion-reduce:animate-none" />
      </aside>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <Skeleton className="mx-auto size-12 rounded-2xl motion-reduce:animate-none" />
          <Skeleton className="mx-auto mt-5 h-6 w-52 motion-reduce:animate-none" />
          <Skeleton className="mx-auto mt-3 h-4 w-72 max-w-full motion-reduce:animate-none" />
        </div>
      </main>
    </div>
  )
}
