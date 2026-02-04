'use client'

import { createContext, useContext, useState } from 'react'

const ThreadContext = createContext<{
  threadId: string | null
  setThreadId: (threadId: string | null) => void
  openThread: (messageId: string) => void
  closeThread: () => void
  toggleThread: (messageId: string) => void
  isThreadOpen: boolean
} | null>(null)

export const ThreadProvider = ({ children }: { children: React.ReactNode }) => {
  const [threadId, setThreadId] = useState<string | null>(null)
  const [isThreadOpen, setIsThreadOpen] = useState(false)

  const openThread = (messageId: string) => {
    setThreadId(messageId)
    setIsThreadOpen(true)
  }

  const closeThread = () => {
    setThreadId(null)
    setIsThreadOpen(false)
  }

  const toggleThread = (messageId: string) => {
    if (isThreadOpen && threadId === messageId) {
      closeThread()
    } else {
      openThread(messageId)
    }
  }

  return (
    <ThreadContext.Provider
      value={{
        threadId,
        setThreadId,
        openThread,
        closeThread,
        toggleThread,
        isThreadOpen,
      }}
    >
      {children}
    </ThreadContext.Provider>
  )
}

export const useThread = () => {
  const context = useContext(ThreadContext)
  if (!context) {
    throw new Error('useThread must be used within a ThreadProvider')
  }
  return context
}
