'use client'

import { Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface MobileChannelSidebarProps {
  children: React.ReactNode
}

export function MobileChannelSidebar({ children }: MobileChannelSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Hash className="size-5" />
          <span className="sr-only">Toggle channels</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        <SheetTitle className="sr-only">Channels</SheetTitle>
        <SheetDescription className="sr-only">
          Browse and select channels in this workspace
        </SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  )
}
