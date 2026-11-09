import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Card, CardContent } from '@/components/ui/card'
import { client } from '@/lib/orpc'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { ArrowUpRight, Building2, Check } from 'lucide-react'
import { CreateWorkspace } from './_components/CreateWorkspace'

const WorkspacePage = async () => {
  const { workspaces, currentWorkspace } = await client.workspace.list()

  return (
    <main className="h-full overflow-y-auto bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8 flex flex-col gap-6 border-b border-border pb-8 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-strong">
              <Building2 aria-hidden="true" className="size-3.5" />
              Team workspace
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Workspaces
            </h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Choose a workspace to pick up where your team left off.
            </p>
          </div>

          {workspaces.length > 0 && <CreateWorkspace triggerVariant="button" />}
        </header>

        {workspaces.length === 0 ? (
          <Empty className="mx-auto w-full max-w-xl rounded-2xl border-dashed bg-card px-6 py-12 shadow-sm sm:px-10">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="size-14 rounded-2xl bg-primary/10 text-primary"
              >
                <Building2 aria-hidden="true" className="size-6" />
              </EmptyMedia>
              <EmptyTitle className="text-xl">No workspaces yet</EmptyTitle>
              <EmptyDescription className="max-w-sm text-sm leading-6">
                Create a workspace to bring your team&apos;s channels and
                conversations together.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <CreateWorkspace triggerVariant="button" />
            </EmptyContent>
          </Empty>
        ) : (
          <section aria-labelledby="workspace-grid-heading">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2
                id="workspace-grid-heading"
                className="text-sm font-semibold text-foreground"
              >
                Your workspaces
              </h2>
              <p className="text-sm tabular-nums text-muted-foreground">
                {workspaces.length}{' '}
                {workspaces.length === 1 ? 'workspace' : 'workspaces'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {workspaces.map((workspace) => {
                const unreadCount = workspace.unreadCount ?? 0
                const isCurrent = workspace.id === currentWorkspace?.orgCode
                const avatar =
                  workspace.avatar || workspace.name.charAt(0).toUpperCase()

                return (
                  <LoginLink
                    key={workspace.id}
                    orgCode={workspace.id}
                    aria-label={`Open ${workspace.name} workspace`}
                    className="group block cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Card className="h-full min-h-52 gap-0 overflow-hidden rounded-2xl border-border/80 bg-card p-0 shadow-sm transition-[border-color,box-shadow,transform] duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-hover:shadow-md motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                      <CardContent className="flex h-full flex-col p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary-strong ring-1 ring-inset ring-primary/10">
                            <span aria-hidden="true">{avatar}</span>
                          </div>

                          <div className="flex flex-wrap justify-end gap-2">
                            {unreadCount > 0 && (
                              <span
                                aria-label={`${unreadCount} unread ${unreadCount === 1 ? 'message' : 'messages'}`}
                                className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-cta/10 px-2.5 text-xs font-semibold tabular-nums text-foreground"
                              >
                                <span
                                  aria-hidden="true"
                                  className="size-1.5 rounded-full bg-cta"
                                />
                                {unreadCount > 99 ? '99+' : unreadCount} unread
                              </span>
                            )}
                            {isCurrent && (
                              <span className="inline-flex min-h-7 items-center gap-1 rounded-full border border-primary/15 bg-primary/5 px-2.5 text-xs font-medium text-primary-strong">
                                <Check
                                  aria-hidden="true"
                                  className="size-3.5"
                                />
                                Current
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 flex flex-1 flex-col">
                          <h3 className="line-clamp-2 break-words text-lg font-semibold leading-6 tracking-tight text-card-foreground">
                            {workspace.name}
                          </h3>
                          <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm">
                            <span className="font-medium text-muted-foreground transition-colors group-hover:text-primary-strong">
                              Open workspace
                            </span>
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </LoginLink>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

export default WorkspacePage
