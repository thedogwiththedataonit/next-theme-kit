"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps as NextThemeProviderProps } from "next-themes"
import { type Theme, themes } from "@/lib/themes"
import { TransitionType, transitions } from "@/lib/transitions"

const THEME_STORAGE_KEY = "theme";
const MODE_STORAGE_KEY = "mode";
const TRANSITION_STORAGE_KEY = "transition";

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
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(THEME_STORAGE_KEY) || defaultTheme
    }
    return defaultTheme
  })
  const [mode, setModeState] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(MODE_STORAGE_KEY) as "light" | "dark") || defaultMode
    }
    return defaultMode
  })
  const [transition, setTransitionState] = useState<TransitionType>(() => {
    if (typeof window !== "undefined") {
      const storedTransition = localStorage.getItem(TRANSITION_STORAGE_KEY) as TransitionType;
      // Check if the stored transition is a valid one by checking if it's a key in the transitions object
      if (storedTransition && Object.prototype.hasOwnProperty.call(transitions, storedTransition)) {
        return storedTransition;
      }
    }
    return defaultTransition;
  });

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme)
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
  }

  const setMode = (newMode: "light" | "dark") => {
    setModeState(newMode)
    if (typeof window !== "undefined") {
      localStorage.setItem(MODE_STORAGE_KEY, newMode)
    }
  }

  const setTransition = (newTransition: TransitionType) => {
    setTransitionState(newTransition);
    if (typeof window !== "undefined") {
      localStorage.setItem(TRANSITION_STORAGE_KEY, newTransition);
    }
  };

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
      // Ensure radius is treated as a string if it's not an object
      if (typeof themeVariant.radius === 'string') {
        root.style.setProperty('--radius', themeVariant.radius);
      } else if (themeVariant.radius && typeof themeVariant.radius === 'object') {
        Object.entries(themeVariant.radius).forEach(([key, value]) => {
          root.style.setProperty(`--radius-${key}`, value as string)
        })
      }
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
      <NextThemesProvider {...props} defaultTheme={theme} enableSystem={false} attribute="class" forcedTheme={theme}>
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

