import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeScript } from '@/components/theme-script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Theme Switcher App',
  description: 'A Next.js 14 app showcasing theme switching with transitions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical styles to prevent flash */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            color-scheme: light dark;
          }
          html {
            transition: background-color 0.2s ease-out;
          }

        `}} />
        
        {/* The theme script runs before body renders to set initial theme */}
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
