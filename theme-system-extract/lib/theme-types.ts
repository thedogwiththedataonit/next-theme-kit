export type Mode = "light" | "dark"

export type TransitionType = 
  | "radial" 
  | "radialblur" 
  | "fade"
  | "morph"
  | "wave"
  | "glitch"
  | "zoom"
  | "slide"
  | "rotate"
  | "ripple"
  | "neon"
  | "matrix"
  | "verci"

export interface TransitionConfig {
  name: string
  type: TransitionType
  duration: number
  easing: string
  applyTransition: (element: HTMLElement, x: number, y: number, maxRadius: number) => void
}

export type Theme = {
  name: string
  label: string
  light: {
    colors: Record<string, string>
    fonts?: {
      sans?: string
      serif?: string
      mono?: string
    }
    radius?: string
    shadows?: Record<string, string>
  }
  dark: {
    colors: Record<string, string>
    fonts?: {
      sans?: string
      serif?: string
      mono?: string
    }
    radius?: string
    shadows?: Record<string, string>
  }
}

export type ThemeState = {
  theme: string
  mode: Mode
  transition: TransitionType
}

export type Coords = { x: number; y: number }

export type ThemeProviderState = {
  theme: string
  mode: Mode
  setTheme: (theme: string) => void
  setMode: (mode: Mode) => void
  toggleMode: (coords?: Coords) => void
  transition: TransitionType
  setTransition: (transition: TransitionType) => void
  themes: Theme[]
} 