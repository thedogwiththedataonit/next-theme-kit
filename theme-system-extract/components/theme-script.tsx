"use client";

import { Theme } from "../lib/theme-types";

interface ThemeScriptProps {
  themes?: Theme[]
  defaultTheme?: string
  storageKey?: string
}

export function ThemeScript({ 
  themes = [], 
  defaultTheme = "default",
  storageKey = "theme-state" 
}: ThemeScriptProps) {
  const scriptContent = `
    (function() {
      const storageKey = "${storageKey}";
      const root = document.documentElement;
      const themes = ${JSON.stringify(themes)};
      const defaultTheme = "${defaultTheme}";
      
      // Get stored theme state
      let themeState = null;
      try {
        const persistedStateJSON = localStorage.getItem(storageKey);
        if (persistedStateJSON) {
          themeState = JSON.parse(persistedStateJSON);
        }
      } catch (e) {
        console.warn("Theme initialization: Failed to read/parse localStorage:", e);
      }

      // Determine if dark mode should be used (stored or system preference)
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mode = themeState?.mode ?? (prefersDark ? "dark" : "light");
      const themeName = themeState?.theme ?? defaultTheme;
      
      // Apply dark mode class if needed
      if (mode === "dark") {
        root.classList.add("dark");
      }
      
      // Apply theme class
      root.classList.add(themeName);
      
      // Get the appropriate theme
      const activeTheme = themes.find(t => t.name === themeName) || 
                          themes.find(t => t.name === defaultTheme) ||
                          themes[0];
                          
      if (activeTheme) {
        const themeVariant = mode === "dark" ? activeTheme.dark : activeTheme.light;
        
        // Apply all the color variables
        if (themeVariant.colors) {
          for (const styleName in themeVariant.colors) {
            const value = themeVariant.colors[styleName];
            if (value !== undefined) {
              root.style.setProperty(\`--\${styleName}\`, value);
            }
          }
        }
        
        // Apply fonts if available
        if (themeVariant.fonts) {
          Object.entries(themeVariant.fonts).forEach(([key, value]) => {
            root.style.setProperty(\`--font-\${key}\`, value);
          });
        }
        
        // Apply radius if available
        if (themeVariant.radius) {
          root.style.setProperty("--radius", themeVariant.radius);
        }
        
        // Apply shadows if available
        if (themeVariant.shadows) {
          Object.entries(themeVariant.shadows).forEach(([key, value]) => {
            root.style.setProperty(\`--shadow\${key === 'DEFAULT' ? '' : \`-\${key}\`}\`, value);
          });
        }
        
        // Set critical properties directly to prevent flash
        const bgColor = themeVariant.colors?.background;
        const fgColor = themeVariant.colors?.foreground;
        
        if (bgColor) {
          const hslMatch = bgColor.match(/(\\d+\\.?\\d*)\\s+(\\d+\\.?\\d*)%\\s+(\\d+\\.?\\d*)%/);
          if (hslMatch) {
            const [_, h, s, l] = hslMatch;
            root.style.backgroundColor = \`hsl(\${h} \${s}% \${l}%)\`;
          } else {
            root.style.backgroundColor = bgColor;
          }
        }
        
        if (fgColor) {
          const hslMatch = fgColor.match(/(\\d+\\.?\\d*)\\s+(\\d+\\.?\\d*)%\\s+(\\d+\\.?\\d*)%/);
          if (hslMatch) {
            const [_, h, s, l] = hslMatch;
            root.style.color = \`hsl(\${h} \${s}% \${l}%)\`;
          } else {
            root.style.color = fgColor;
          }
        }
      }
      
      // Store the state if it wasn't stored already
      if (!themeState) {
        try {
          localStorage.setItem(storageKey, JSON.stringify({
            theme: themeName,
            mode: mode,
            transition: "radial"
          }));
        } catch (e) {
          console.warn("Theme initialization: Failed to write to localStorage:", e);
        }
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      suppressHydrationWarning
    />
  );
} 