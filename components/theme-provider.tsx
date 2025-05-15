"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type Theme, themes } from "@/lib/themes"
import { TransitionType } from "@/lib/transitions"

type Mode = "light" | "dark"

type ThemeState = {
  theme: string
  mode: Mode
  transition: TransitionType
}

type ThemeProviderProps = {
  children: React.ReactNode
}

type Coords = { x: number; y: number }

type ThemeProviderState = {
  theme: string
  mode: Mode
  setTheme: (theme: string) => void
  setMode: (mode: Mode) => void
  toggleMode: (coords?: Coords) => void
  transition: TransitionType
  setTransition: (transition: TransitionType) => void
  themes: Theme[]
}

const initialState: ThemeProviderState = {
  theme: "default",
  mode: "light",
  setTheme: () => null,
  setMode: () => null,
  toggleMode: () => null,
  transition: "radial",
  setTransition: () => null,
  themes,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  // We'll use the localStorage or document classes to initialize our state
  const [state, setState] = useState<ThemeState>(() => {
    // Default state for SSR
    if (typeof window === 'undefined') {
      return {
        theme: "default",
        mode: "light",
        transition: "radial",
      }
    }
    
    try {
      // First check if we have something in localStorage
      const storageKey = "theme-state"
      const stored = localStorage.getItem(storageKey)
      
      if (stored) {
        return JSON.parse(stored)
      }
      
      // Otherwise check document classes (set by ThemeScript)
      const root = document.documentElement
      const isDark = root.classList.contains("dark")
      
      // Check which theme is applied
      let appliedTheme = "default"
      for (const theme of themes) {
        if (root.classList.contains(theme.name)) {
          appliedTheme = theme.name
          break
        }
      }
      
      // Return state based on document classes
      return {
        theme: appliedTheme,
        mode: isDark ? "dark" : "light",
        transition: "radial",
      }
    } catch (e) {
      console.warn("ThemeProvider: Failed to initialize from localStorage or document classes:", e)
      return {
        theme: "default",
        mode: "light", 
        transition: "radial",
      }
    }
  })

  const setTheme = (theme: string) => {
    setState((prev) => {
      const newState = { ...prev, theme }
      try {
        localStorage.setItem("theme-state", JSON.stringify(newState))
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
        localStorage.setItem("theme-state", JSON.stringify(newState))
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

    if (!document.startViewTransition || prefersReducedMotion) {
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
        localStorage.setItem("theme-state", JSON.stringify(newState))
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
      if (typeof themeVariant.radius === 'string') {
        root.style.setProperty('--radius', themeVariant.radius)
      } else if (typeof themeVariant.radius === 'object') {
        Object.entries(themeVariant.radius).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--radius-${key}`, value)
          }
        })
      }
    }
    
    // Set critical properties directly to prevent flash
    if (state.mode === "dark") {
      root.style.backgroundColor = themeVariant.colors?.background || "#000"
      root.style.color = themeVariant.colors?.foreground || "#fff"
    } else {
      root.style.backgroundColor = themeVariant.colors?.background || "#fff"
      root.style.color = themeVariant.colors?.foreground || "#000"
    }
  }, [state.theme, state.mode])

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


