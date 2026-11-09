'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Loader, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { WorkspaceSchema, workspaceSchema } from '@/app/schemas/workspace'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'
import { toast } from 'sonner'
import { isDefinedError } from '@orpc/client'
import { useRouter } from 'next/navigation'

interface CreateWorkspaceProps {
  triggerVariant?: 'icon' | 'button'
}

export const CreateWorkspace = ({
  triggerVariant = 'icon',
}: CreateWorkspaceProps) => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
    },
  })

  const createWorkspace = useMutation(
    orpc.workspace.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workspace "${data.workspaceName}" created successfully!`)
        // refresh the workspace list
        queryClient.invalidateQueries({
          queryKey: orpc.workspace.list.queryKey(),
        })
        router.refresh()
        setOpen(false)
        form.reset()
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          if (error.code === 'RATE_LIMITED') {
            toast.error(error.message)
            return
          }

          toast.error(error.message)
          return
        }
        toast.error('Failed to create workspace. Please try again.')
      },
    }),
  )

  const onSubmit = (data: WorkspaceSchema) => {
    createWorkspace.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerVariant === 'button' ? (
        <DialogTrigger asChild>
          <Button type="button" className="h-11 rounded-xl px-4 shadow-sm">
            <Plus aria-hidden="true" className="size-4" />
            Create workspace
          </Button>
        </DialogTrigger>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Create workspace"
                className="size-12 rounded-xl border-2 border-dashed border-muted-foreground/50 text-muted-foreground transition-all duration-200 motion-reduce:transition-none hover:rounded-lg hover:border-muted-foreground hover:text-foreground"
              >
                <Plus aria-hidden="true" className="size-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Create workspace</p>
          </TooltipContent>
        </Tooltip>
      )}

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to collaborate with your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="Workspace name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={createWorkspace.isPending}
              type="submit"
              className="h-11 w-full sm:w-auto"
            >
              {createWorkspace.isPending && (
                <Loader
                  aria-hidden="true"
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
              )}
              {createWorkspace.isPending ? 'Creating...' : 'Create Workspace'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
