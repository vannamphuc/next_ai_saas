import { Button } from '@/components/ui/button'
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/components/ui/emoji-picker'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'
import { SmilePlus } from 'lucide-react'
import { useState } from 'react'

interface EmojiReactionProps {
  onSelect: (emoji: string) => void
}

export const EmojiReaction = ({ onSelect }: EmojiReactionProps) => {
  const [open, setOpen] = useState(false)

  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6">
          <SmilePlus className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      {open && (
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            'bg-popover text-popover-foreground z-50 w-fit origin-(--radix-popover-content-transform-origin) rounded-md border p-0 shadow-md outline-hidden',
          )}
        >
          <EmojiPicker
            className="h-[300px]"
            onEmojiSelect={(e) => handleEmojiSelect(e.emoji)}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverPrimitive.Content>
      )}
    </Popover>
  )
}
