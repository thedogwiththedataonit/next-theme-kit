// Main exports for the theme system
export { ThemeProvider, useTheme } from './components/theme-provider'
export { ThemeScript } from './components/theme-script'
export { ThemeSwitcher, useThemeSwitcher } from './components/theme-switcher'

// Type exports
export type {
  Theme,
  Mode,
  TransitionType,
  TransitionConfig,
  ThemeState,
  ThemeProviderState,
  Coords
} from './lib/theme-types'

// Utility exports
export { transitions } from './lib/transitions'
export { defaultTheme, minimalThemes } from './lib/default-themes' 