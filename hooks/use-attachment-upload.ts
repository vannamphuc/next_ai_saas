"use client"

import { useCallback, useMemo, useState } from "react"

export const useAttachmentUpload = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [stagedUrl, setStagedUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const onUploaded = useCallback((url: string) => {
        setStagedUrl(url)
        setIsUploading(false)
        setIsOpen(false)
    }, [])

    const clear = useCallback(() => {
        setStagedUrl(null)
        setIsUploading(false)
    }, [])

    return useMemo(() => ({
        isOpen,
        setIsOpen,
        onUploaded,
        isUploading,
        stagedUrl,
        clear,
    }), [isOpen, setIsOpen, onUploaded, isUploading, stagedUrl, clear])
}

export type UseAttachmentUploadType = ReturnType<typeof useAttachmentUpload>