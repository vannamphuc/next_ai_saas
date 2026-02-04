import { Skeleton } from '@/components/ui/skeleton'

export const ThreadSkeleton = () => {
  return (
    <>
      {/* Parent Message Skeleton */}
      <div className="p-4 border-b bg-muted/20">
        <div className="flex space-x-2">
          <Skeleton className="size-8 rounded-full shrink-0" />

          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Thread Replies Skeleton */}
      <div className="p-2">
        <Skeleton className="h-3 w-16 mb-3 mx-2" />

        <div className="space-y-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3 p-3">
              <Skeleton className="size-8 rounded-full shrink-0" />

              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>

                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
