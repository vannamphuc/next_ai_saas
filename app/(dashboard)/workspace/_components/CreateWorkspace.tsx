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

export const CreateWorkspace = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

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
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-12 rounded-xl border-2 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-200"
            >
              <Plus className="size-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Create Workspace</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[425px]">
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
                    <Input placeholder="Work space name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={createWorkspace.isPending} type="submit">
              {createWorkspace.isPending && (
                <Loader className="animate-spin size-4" />
              )}
              {createWorkspace.isPending ? 'Creating...' : 'Create Workspace'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
