import { UploadDropzone } from '@/lib/uploadthing'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'

interface ImageUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploaded: (url: string) => void
}

export const ImageUploadModal = ({
  open,
  onOpenChange,
  onUploaded,
}: ImageUploadModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <UploadDropzone
          className="ut-uploading:opacity-90 ut-ready:bg-card ut-ready:border-border ut-ready:text-foreground ut-uploading:bg-muted ut-uploading:border-border ut-uploading:text-muted-foreground ut-label:text-sm ut-label:text-muted-foreground ut-allowed-content:text-xs ut-allowed-content:text-muted-foreground ut-button:bg-primary rounded-lg border ut-button:ut-uploading:after:bg-primary/90"
          endpoint={'imageUploader'}
          onClientUploadComplete={(res) => {
            const url = res[0].ufsUrl
            onUploaded(url)
            toast.success('Image uploaded successfully')
          }}
          onUploadError={(err) => {
            toast.error(err.message)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
