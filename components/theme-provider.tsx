"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemeProviderProps } from "next-themes"
import { type Theme, themes } from "@/lib/themes"
import { TransitionType, transitions } from "@/lib/transitions"

type ThemeProviderProps = NextThemeProviderProps & {
  children: React.ReactNode
  defaultTheme?: string
  defaultMode?: "light" | "dark"
  defaultTransition?: TransitionType
}

type ThemeProviderState = {
  theme: string
  setTheme: (theme: string) => void
  themes: Theme[]
  mode: "light" | "dark"
  setMode: (mode: "light" | "dark") => void
  transition: TransitionType
  setTransition: (transition: TransitionType) => void
}

const initialState: ThemeProviderState = {
  theme: "default",
  setTheme: () => null,
  themes: themes,
  mode: "light",
  setMode: () => null,
  transition: "radial",
  setTransition: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "default",
  defaultMode = "light",
  defaultTransition = "radial",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState(defaultTheme)
  const [mode, setMode] = useState<"light" | "dark">(defaultMode)
  const [transition, setTransition] = useState<TransitionType>(defaultTransition)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove previous theme classes
    root.classList.remove(...themes.map((t) => t.name))

    // Add new theme class
    root.classList.add(theme)

    // Handle dark mode
    if (mode === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Apply theme CSS variables
    const currentTheme = themes.find((t) => t.name === theme)
    if (currentTheme) {
      const themeVariant = mode === "dark" ? currentTheme.dark : currentTheme.light
      Object.entries(themeVariant.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value)
      })
      Object.entries(themeVariant.fonts).forEach(([key, value]) => {
        root.style.setProperty(`--font-${key}`, value)
      })
      Object.entries(themeVariant.radius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value)
      })
      Object.entries(themeVariant.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value)
      })
    }
  }, [theme, mode])

  const value = {
    theme,
    setTheme,
    themes,
    mode,
    setMode,
    transition,
    setTransition,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      <NextThemesProvider {...props} defaultTheme={defaultTheme}>
        {children}
      </NextThemesProvider>
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
