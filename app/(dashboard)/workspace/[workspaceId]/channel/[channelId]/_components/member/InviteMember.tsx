'use client'

import { InviteMemberSchema, inviteMemberSchema } from '@/app/schemas/member'
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
import { orpc } from '@/lib/orpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const InviteMember = () => {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })

  const inviteMemberMutation = useMutation(
    orpc.workspace.member.invite.mutationOptions({
      onSuccess: () => {
        toast.success('Member invited successfully')
        form.reset()
        setOpen(false)
        queryClient.invalidateQueries({
          queryKey: orpc.workspace.member.list.queryKey(),
        })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }),
  )

  const onSubmit = async (data: InviteMemberSchema) => {
    inviteMemberMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite new members to join your workspace
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
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={inviteMemberMutation.isPending}>
              {inviteMemberMutation.isPending && (
                <Loader className="animate-spin size-4" />
              )}
              Send invitation
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default InviteMember
