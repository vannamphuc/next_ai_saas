'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface MobileSidebarProps {
  children: React.ReactNode
  side?: 'left' | 'right'
}

export function MobileSidebar({ children, side = 'left' }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className="p-0 border-r-0 max-w-[300px] sm:max-w-[350px]"
      >
        <SheetTitle className="sr-only">Menu Navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Access workspaces and channels
        </SheetDescription>
        {children}
      </SheetContent>
    </Sheet>
  )
}
