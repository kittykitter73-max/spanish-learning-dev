import './styles.css'

export const metadata = {
  title: 'Borao — Spanish that sticks',
  description: 'Entertainment-first Spanish learning.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
