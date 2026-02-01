import { RichTextEditor } from '@/components/rich-text-edior/Editor'
import { ImageUploadModal } from '@/components/rich-text-edior/ImageUploadModal'
import { Button } from '@/components/ui/button'
import { UseAttachmentUploadType } from '@/hooks/use-attachment-upload'
import { ImageIcon, Loader, Send } from 'lucide-react'
import { AttachmentChip } from './AttachmentChip'

interface IAppProps {
  value: string
  onChange: (next: string) => void
  onSubmit: () => void
  isSubmitting?: boolean
  upload: UseAttachmentUploadType
}

export const MessageComposer = ({
  onChange,
  value,
  onSubmit,
  isSubmitting,
  upload,
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
          upload.stagedUrl ? (
            <>
              <AttachmentChip url={upload.stagedUrl} onRemove={upload.clear} />
            </>
          ) : (
            <Button
              onClick={() => {
                upload.setIsOpen(true)
              }}
              type="button"
              size="sm"
              variant="outline"
            >
              <ImageIcon className="size-4 mr-1" />
              Attach
            </Button>
          )
        }
      />

      <ImageUploadModal
        open={upload.isOpen}
        onOpenChange={upload.setIsOpen}
        onUploaded={(url) => upload.onUploaded(url)}
      />
    </>
  )
}
