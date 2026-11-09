import '@/lib/orpc.server'
import type { Metadata } from 'next'
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/theme-provider'
import { Outfit, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/lib/providers'
import { Toaster } from '@/components/ui/sonner'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.KINDE_SITE_URL ?? 'http://localhost:3000'),
  title: 'VPFlow — AI-ready team communication',
  description:
    'Channels, threads and AI summaries that keep product teams in sync.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${outfit.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>{children}</Providers>
            <Toaster richColors closeButton position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  )
}
