import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Theme Switcher",
  description: "A theme switching application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="custom">{children}</ThemeProvider>
      </body>
    </html>
  )
}
