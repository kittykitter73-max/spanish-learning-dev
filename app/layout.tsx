import type { Metadata, Viewport } from 'next'
import PlayerProvider from '@/components/player/PlayerProvider'
import './styles.css'

export const metadata: Metadata = {
  title: 'Borao — Spanish that sticks',
  description: 'Entertainment-first Spanish learning.',
  applicationName: 'Borao',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Borao',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#201a20',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><PlayerProvider>{children}</PlayerProvider></body>
    </html>
  )
}
