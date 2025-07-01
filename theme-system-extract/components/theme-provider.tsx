"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { 
  type Theme, 
  type Mode, 
  type ThemeState, 
  type ThemeProviderState, 
  type Coords,
  type TransitionType 
} from "../lib/theme-types"
import { minimalThemes } from "../lib/default-themes"

type ThemeProviderProps = {
  children: React.ReactNode
  themes?: Theme[]
  defaultTheme?: string
  defaultMode?: Mode
  defaultTransition?: TransitionType
  storageKey?: string
  enableTransitions?: boolean
}

const initialState: ThemeProviderState = {
  theme: "default",
  mode: "light",
  setTheme: () => null,
  setMode: () => null,
  toggleMode: () => null,
  transition: "radial",
  setTransition: () => null,
  themes: minimalThemes,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  themes = minimalThemes,
  defaultTheme = "default",
  defaultMode = "light",
  defaultTransition = "radial",
  storageKey = "theme-state",
  enableTransitions = true,
}: ThemeProviderProps) {
  const [state, setState] = useState<ThemeState>(() => {
    // Default state for SSR
    if (typeof window === 'undefined') {
      return {
        theme: defaultTheme,
        mode: defaultMode,
        transition: defaultTransition,
      }
    }
    
    try {
      // First check if we have something in localStorage
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate stored theme exists
        if (themes.some(t => t.name === parsed.theme)) {
          return parsed
        }
      }
      
      // Otherwise check document classes (set by ThemeScript)
      const root = document.documentElement
      const isDark = root.classList.contains("dark")
      
      // Check which theme is applied
      let appliedTheme = defaultTheme
      for (const theme of themes) {
        if (root.classList.contains(theme.name)) {
          appliedTheme = theme.name
          break
        }
      }
      
      // Return state based on document classes
      return {
        theme: appliedTheme,
        mode: isDark ? "dark" : defaultMode,
        transition: defaultTransition,
      }
    } catch (e) {
      console.warn("ThemeProvider: Failed to initialize from localStorage or document classes:", e)
      return {
        theme: defaultTheme,
        mode: defaultMode, 
        transition: defaultTransition,
      }
    }
  })

  const setTheme = (theme: string) => {
    setState((prev) => {
      const newState = { ...prev, theme }
      try {
        localStorage.setItem(storageKey, JSON.stringify(newState))
      } catch (e) {
        console.warn("ThemeProvider: Failed to write to localStorage:", e)
      }
      return newState
    })
  }

  const setMode = (mode: Mode) => {
    setState((prev) => {
      const newState = { ...prev, mode }
      try {
        localStorage.setItem(storageKey, JSON.stringify(newState))
      } catch (e) {
        console.warn("ThemeProvider: Failed to write to localStorage:", e)
      }
      return newState
    })
  }

  const toggleMode = (coords?: Coords) => {
    const root = document.documentElement
    const newMode = state.mode === "light" ? "dark" : "light"

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (!enableTransitions || !document.startViewTransition || prefersReducedMotion) {
      setMode(newMode)
      return
    }

    if (coords) {
      root.style.setProperty("--x", `${coords.x}px`)
      root.style.setProperty("--y", `${coords.y}px`)
    }

    document.startViewTransition(() => {
      setMode(newMode)
    })
  }

  const setTransition = (transition: TransitionType) => {
    setState((prev) => {
      const newState = { ...prev, transition }
      try {
        localStorage.setItem(storageKey, JSON.stringify(newState))
      } catch (e) {
        console.warn("ThemeProvider: Failed to write to localStorage:", e)
      }
      return newState
    })
  }

  // Apply theme when state changes (after initial render)
  useEffect(() => {
    const root = document.documentElement
    const currentTheme = themes.find((t) => t.name === state.theme)
    
    if (!currentTheme) return
    
    const themeVariant = state.mode === "dark" ? currentTheme.dark : currentTheme.light
    if (!themeVariant) return

    // Clear all theme classes first
    const themeClasses = []
    for (const className of root.classList) {
      if (themes.some(t => t.name === className)) {
        themeClasses.push(className)
      }
    }
    themeClasses.forEach(cls => root.classList.remove(cls))
    
    // Apply theme class
    root.classList.add(state.theme)
    
    // Toggle dark class
    if (state.mode === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Apply theme variables
    if (themeVariant.colors) {
      Object.entries(themeVariant.colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--${key}`, value)
        }
      })
    }
    
    // Apply fonts
    if (themeVariant.fonts) {
      Object.entries(themeVariant.fonts).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--font-${key}`, value)
        }
      })
    }
    
    // Apply radius
    if (themeVariant.radius) {
      root.style.setProperty('--radius', themeVariant.radius)
    }
    
    // Apply shadows
    if (themeVariant.shadows) {
      Object.entries(themeVariant.shadows).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--shadow${key === 'DEFAULT' ? '' : `-${key}`}`, value)
        }
      })
    }
    
    // Set critical properties directly to prevent flash
    const bgColor = themeVariant.colors?.background
    const fgColor = themeVariant.colors?.foreground
    
    if (bgColor) {
      // Convert HSL to RGB for immediate application
      const hslMatch = bgColor.match(/(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%/)
      if (hslMatch) {
        const [_, h, s, l] = hslMatch
        root.style.backgroundColor = `hsl(${h} ${s}% ${l}%)`
      } else {
        root.style.backgroundColor = bgColor
      }
    }
    
    if (fgColor) {
      const hslMatch = fgColor.match(/(\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%/)
      if (hslMatch) {
        const [_, h, s, l] = hslMatch
        root.style.color = `hsl(${h} ${s}% ${l}%)`
      } else {
        root.style.color = fgColor
      }
    }
  }, [state.theme, state.mode, themes])

  const value: ThemeProviderState = {
    theme: state.theme,
    mode: state.mode,
    setTheme,
    setMode,
    toggleMode,
    transition: state.transition,
    setTransition,
    themes,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
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