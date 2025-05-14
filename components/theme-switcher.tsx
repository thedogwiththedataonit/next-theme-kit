"use client"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette, Sun, Moon, Sparkles } from "lucide-react"
import { useRef } from "react"
import { flushSync } from "react-dom"
import { transitions, type TransitionType } from "@/lib/transitions"

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

export function ThemeSwitcher() {
  const { theme, setTheme, themes, mode, setMode, transition, setTransition } = useTheme()
  const themeButtonRef = useRef<HTMLButtonElement>(null)

  const handleThemeChange = async (newTheme: string) => {
    if (
      !themeButtonRef.current ||
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

    const { top, left, width, height } = themeButtonRef.current.getBoundingClientRect()
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
      !themeButtonRef.current ||
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

    const { top, left, width, height } = themeButtonRef.current.getBoundingClientRect()
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
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={themeButtonRef}
            variant="outline"
            size="icon"
          >
            <Palette className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Select theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themes.map((t) => (
            <DropdownMenuItem
              key={t.name}
              onClick={() => handleThemeChange(t.name)}
              className={theme === t.name ? "bg-accent" : ""}
            >
              {t.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sparkles className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Select transition</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.values(transitions).map((t) => (
            <DropdownMenuItem
              key={t.type}
              onClick={() => setTransition(t.type)}
              className={transition === t.type ? "bg-accent" : ""}
            >
              {t.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handleModeChange("light")}
        className={mode === "light" ? "bg-accent" : ""}
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Light mode</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handleModeChange("dark")}
        className={mode === "dark" ? "bg-accent" : ""}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Dark mode</span>
      </Button>
    </div>
  )
}
