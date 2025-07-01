"use client"

import { useTheme } from "./theme-provider"
import { useRef } from "react"
import { flushSync } from "react-dom"
import { transitions } from "../lib/transitions"
import { type TransitionType } from "../lib/theme-types"

// Add styles for view transitions
const styles = `
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
`

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

interface ThemeSwitcherProps {
  className?: string
  showTransitions?: boolean
}

/**
 * Example theme switcher component.
 * This is a minimal implementation that you can replace with your own UI components.
 * 
 * You can use any UI library (Material-UI, Ant Design, Chakra UI, etc.) or custom components.
 * The key is to use the `useTheme` hook to get and set theme values.
 */
export function ThemeSwitcher({ className = "", showTransitions = true }: ThemeSwitcherProps) {
  const { theme, setTheme, themes, mode, setMode, transition, setTransition } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleThemeChange = async (newTheme: string) => {
    if (
      !buttonRef.current ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(newTheme)
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
      })
    }).ready

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const right = window.innerWidth - left
    const bottom = window.innerHeight - top
    const maxRadius = Math.hypot(
      Math.max(left, right),
      Math.max(top, bottom)
    )

    transitions[transition].applyTransition(document.documentElement, x, y, maxRadius)
  }

  const handleModeChange = async (newMode: "light" | "dark") => {
    if (
      !buttonRef.current ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setMode(newMode)
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setMode(newMode)
      })
    }).ready

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const right = window.innerWidth - left
    const bottom = window.innerHeight - top
    const maxRadius = Math.hypot(
      Math.max(left, right),
      Math.max(top, bottom)
    )

    transitions[transition].applyTransition(document.documentElement, x, y, maxRadius)
  }

  return (
    <div className={`theme-switcher ${className}`}>
      {/* Theme selector */}
      <div className="theme-selector">
        <label htmlFor="theme-select">Theme:</label>
        <select 
          id="theme-select"
          value={theme} 
          onChange={(e) => handleThemeChange(e.target.value)}
        >
          {themes.map((t) => (
            <option key={t.name} value={t.name}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Light/Dark mode toggle */}
      <div className="mode-toggle">
        <button
          ref={buttonRef}
          onClick={() => handleModeChange(mode === "light" ? "dark" : "light")}
          aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        >
          {mode === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Transition selector (optional) */}
      {showTransitions && (
        <div className="transition-selector">
          <label htmlFor="transition-select">Transition:</label>
          <select 
            id="transition-select"
            value={transition} 
            onChange={(e) => setTransition(e.target.value as TransitionType)}
          >
            {Object.values(transitions).map((t) => (
              <option key={t.type} value={t.type}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

/**
 * Minimal hook for creating custom theme switcher components
 */
export function useThemeSwitcher() {
  const { theme, setTheme, themes, mode, setMode, transition, setTransition } = useTheme()

  const applyThemeWithTransition = async (
    newTheme: string,
    coords: { x: number; y: number }
  ) => {
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(newTheme)
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
      })
    }).ready

    const maxRadius = Math.hypot(
      Math.max(coords.x, window.innerWidth - coords.x),
      Math.max(coords.y, window.innerHeight - coords.y)
    )

    transitions[transition].applyTransition(document.documentElement, coords.x, coords.y, maxRadius)
  }

  const applyModeWithTransition = async (
    newMode: "light" | "dark",
    coords: { x: number; y: number }
  ) => {
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMode(newMode)
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setMode(newMode)
      })
    }).ready

    const maxRadius = Math.hypot(
      Math.max(coords.x, window.innerWidth - coords.x),
      Math.max(coords.y, window.innerHeight - coords.y)
    )

    transitions[transition].applyTransition(document.documentElement, coords.x, coords.y, maxRadius)
  }

  return {
    theme,
    themes,
    mode,
    transition,
    setTheme,
    setMode,
    setTransition,
    applyThemeWithTransition,
    applyModeWithTransition,
  }
} 