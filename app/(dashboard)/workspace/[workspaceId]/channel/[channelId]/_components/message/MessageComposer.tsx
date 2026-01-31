import { RichTextEditor } from '@/components/rich-text-edior/Editor'
import { Button } from '@/components/ui/button'
import { ImageIcon, Loader, Send } from 'lucide-react'

interface IAppProps {
  value: string
  onChange: (next: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export const MessageComposer = ({
  onChange,
  value,
  onSubmit,
  isSubmitting,
}: IAppProps) => {
  return (
    <>
      <RichTextEditor
        field={{ value, onChange }}
        sendButton={
          <Button
            type="button"
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader className="animate-spin" />}
            <Send className="size-4 mr-1" />
            Send
          </Button>
        }
        footerLeft={
          <Button type="button" size="sm" variant="outline">
            <ImageIcon className="size-4 mr-1" />
            Attach
          </Button>
        }
      />
    </>
  )
}
