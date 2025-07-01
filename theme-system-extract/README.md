# Next.js Theme System

A complete theme switching system for Next.js with support for multiple themes, light/dark modes, and smooth animated transitions.

## Features

- 🎨 **Multiple Theme Support** - Define unlimited custom themes
- 🌓 **Light/Dark Mode** - Built-in support with system preference detection
- ✨ **Smooth Transitions** - 13+ beautiful transition effects using View Transitions API
- 🚀 **Zero Flash** - No theme flashing on page load
- 💾 **Persistent State** - Remembers user's theme preference
- 📱 **Responsive** - Works on all devices
- ♿ **Accessible** - Respects prefers-reduced-motion
- 🎯 **Type-Safe** - Full TypeScript support
- 🔧 **Framework Agnostic CSS** - Use with Tailwind, CSS Modules, or any CSS solution

## Installation

### 1. Copy the theme system files

Copy the `theme-system-extract` folder to your Next.js project and rename it to something like `theme-system` or `lib/theme`.

### 2. Install dependencies

The only required dependencies are React and Next.js. The system works with:
- Next.js 13+ (App Router)
- React 18+

### 3. Add the base CSS

Add the base CSS to your global styles or create a new CSS file:

```css
/* app/globals.css */
@import '../theme-system/styles/base.css';

/* Or include the CSS content directly */
```

### 4. Update your root layout

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/theme-system'
import { ThemeScript } from '@/theme-system'
import { themes } from './themes' // Your custom themes

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevents flash of unstyled content */}
        <ThemeScript themes={themes} />
      </head>
      <body>
        <ThemeProvider themes={themes}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Usage

### Basic Theme Switcher

```tsx
import { ThemeSwitcher } from '@/theme-system'

export function Header() {
  return (
    <header>
      <ThemeSwitcher />
    </header>
  )
}
```

### Custom Theme Switcher

```tsx
import { useTheme } from '@/theme-system'

export function CustomThemeSwitcher() {
  const { theme, setTheme, mode, toggleMode, themes } = useTheme()

  return (
    <div>
      {/* Theme selector */}
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {themes.map((t) => (
          <option key={t.name} value={t.name}>{t.label}</option>
        ))}
      </select>

      {/* Mode toggle */}
      <button onClick={() => toggleMode()}>
        {mode === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  )
}
```

### With Transitions

```tsx
import { useThemeSwitcher } from '@/theme-system'

export function AnimatedThemeSwitcher() {
  const { mode, applyModeWithTransition } = useThemeSwitcher()

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    
    applyModeWithTransition(
      mode === 'light' ? 'dark' : 'light',
      { x, y }
    )
  }

  return (
    <button onClick={handleClick}>
      Toggle with animation
    </button>
  )
}
```

## Creating Custom Themes

```typescript
// themes.ts
import { Theme } from '@/theme-system'

export const themes: Theme[] = [
  {
    name: "my-theme",
    label: "My Custom Theme",
    light: {
      colors: {
        background: "0 0% 100%",          // White
        foreground: "222 47% 11%",        // Dark gray
        primary: "221 83% 53%",           // Blue
        "primary-foreground": "0 0% 100%", // White
        secondary: "210 40% 96%",         // Light blue
        "secondary-foreground": "222 47% 11%",
        // Add more color variables as needed
      },
      fonts: {
        sans: "Inter, sans-serif",
        mono: "Fira Code, monospace",
      },
      radius: "0.5rem",
    },
    dark: {
      colors: {
        background: "222 47% 11%",        // Dark gray
        foreground: "0 0% 100%",          // White
        primary: "217 91% 60%",           // Light blue
        "primary-foreground": "222 47% 11%",
        secondary: "217 33% 17%",         // Dark blue
        "secondary-foreground": "0 0% 100%",
        // Add more color variables as needed
      },
      fonts: {
        sans: "Inter, sans-serif",
        mono: "Fira Code, monospace",
      },
      radius: "0.5rem",
    },
  },
]
```

## Using with Different UI Libraries

### With Tailwind CSS

The theme system works perfectly with Tailwind CSS. Your color values should be in HSL format:

```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more colors
      },
    },
  },
}
```

### With CSS Modules

```css
/* Button.module.css */
.button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
}
```

### With styled-components

```tsx
import styled from 'styled-components'

const Button = styled.button`
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
`
```

## Configuration Options

### ThemeProvider Props

- `themes` - Array of theme objects
- `defaultTheme` - Initial theme name (default: "default")
- `defaultMode` - Initial mode (default: "light")
- `defaultTransition` - Initial transition type (default: "radial")
- `storageKey` - localStorage key for persistence (default: "theme-state")
- `enableTransitions` - Enable/disable transitions (default: true)

### ThemeScript Props

- `themes` - Array of theme objects (same as ThemeProvider)
- `defaultTheme` - Default theme name
- `storageKey` - localStorage key (should match ThemeProvider)

## Advanced Usage

### Custom Transitions

```typescript
import { transitions } from '@/theme-system'

// Modify existing transition
transitions.radial.duration = 500

// Add custom transition
transitions.custom = {
  name: "Custom",
  type: "custom",
  duration: 400,
  easing: "ease-out",
  applyTransition: (element, x, y, maxRadius) => {
    element.animate(
      {
        opacity: [0, 1],
        transform: ['scale(0.8)', 'scale(1)'],
      },
      {
        duration: 400,
        easing: "ease-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  },
}
```

### Server-Side Rendering

The theme system is SSR-friendly. The `ThemeScript` component ensures that:
1. The correct theme is applied before the page renders
2. There's no flash of unstyled content
3. The system preference is respected

### Accessing Theme Values in JavaScript

```tsx
const { theme, mode, themes } = useTheme()

// Get current theme object
const currentTheme = themes.find(t => t.name === theme)
const colors = mode === 'dark' ? currentTheme?.dark.colors : currentTheme?.light.colors
```

## Browser Support

- Chrome/Edge 111+ (full support with View Transitions)
- Firefox, Safari (themes work, transitions fallback to instant change)
- Respects `prefers-reduced-motion` media query

## TypeScript

The theme system is fully typed. Import types as needed:

```typescript
import type { Theme, Mode, TransitionType } from '@/theme-system'
```

## Migration from next-themes

If you're migrating from `next-themes`, the API is similar:

```tsx
// next-themes
const { theme, setTheme } = useTheme()

// This theme system
const { mode, setMode, theme, setTheme } = useTheme()
```

Key differences:
- Separate `theme` (color scheme) and `mode` (light/dark)
- Built-in transition support
- More comprehensive theme definitions

## Optimization Tips

1. **Minimize theme data** - Only include colors you actually use
2. **Lazy load themes** - Load additional themes on demand
3. **Use CSS custom properties** - The system uses CSS variables for instant updates
4. **Preload fonts** - Add font preload tags for custom fonts

## License

MIT

## Contributing

Feel free to customize and extend this theme system for your needs! 