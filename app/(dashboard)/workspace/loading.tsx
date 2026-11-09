import { Skeleton } from '@/components/ui/skeleton'

export default function WorkspaceListLoading() {
  return (
    <main
      role="status"
      aria-label="Loading your workspaces"
      className="h-full overflow-y-auto bg-background p-5 md:p-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        <Skeleton className="h-8 w-48 motion-reduce:animate-none" />
        <Skeleton className="mt-3 h-5 w-72 max-w-full motion-reduce:animate-none" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-5"
            >
              <Skeleton className="size-11 rounded-xl motion-reduce:animate-none" />
              <Skeleton className="mt-5 h-5 w-32 motion-reduce:animate-none" />
              <Skeleton className="mt-2 h-4 w-44 max-w-full motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
