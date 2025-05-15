"use client";

import { themes } from "@/lib/themes";

// Extract default light and dark styles from the default theme
const defaultTheme = themes.find(t => t.name === "default") || themes[0];
const defaultLightStyles = defaultTheme?.light?.colors || {};
const defaultDarkStyles = defaultTheme?.dark?.colors || {};

export function ThemeScript() {
  const scriptContent = `
    (function() {
      const storageKey = "theme-state";
      const root = document.documentElement;
      
      // Define default styles for light and dark modes
      const defaultLightStyles = ${JSON.stringify(defaultLightStyles)};
      const defaultDarkStyles = ${JSON.stringify(defaultDarkStyles)};

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
      const themeName = themeState?.theme ?? "default";
      
      // Apply dark mode class if needed
      if (mode === "dark") {
        root.classList.add("dark");
      }
      
      // Apply theme class
      root.classList.add(themeName);
      
      // Get the appropriate styles for the current mode
      const activeTheme = ${JSON.stringify(themes)}.find(t => t.name === themeName) || 
                          ${JSON.stringify(themes)}.find(t => t.name === "default");
                          
      const activeStyles = 
        mode === "dark"
          ? (activeTheme?.dark?.colors || defaultDarkStyles)
          : (activeTheme?.light?.colors || defaultLightStyles);
      
      // Apply all the color variables
      for (const styleName in activeStyles) {
        const value = activeStyles[styleName];
        if (value !== undefined) {
          root.style.setProperty(\`--\${styleName}\`, value);
        }
      }
      
      // Set critical properties directly to prevent flash
      if (mode === "dark") {
        root.style.backgroundColor = activeStyles.background || "#000";
        root.style.color = activeStyles.foreground || "#fff";
      } else {
        root.style.backgroundColor = activeStyles.background || "#fff";
        root.style.color = activeStyles.foreground || "#000";
      }
      
      // Apply fonts if available
      if (activeTheme) {
        const themeVariant = mode === "dark" ? activeTheme.dark : activeTheme.light;
        if (themeVariant?.fonts) {
          Object.entries(themeVariant.fonts).forEach(([key, value]) => {
            root.style.setProperty(\`--font-\${key}\`, value);
          });
        }
        
        // Apply radius if available
        if (themeVariant?.radius) {
          if (typeof themeVariant.radius === "string") {
            root.style.setProperty("--radius", themeVariant.radius);
          } else if (typeof themeVariant.radius === "object") {
            Object.entries(themeVariant.radius).forEach(([key, value]) => {
              root.style.setProperty(\`--radius-\${key}\`, value);
            });
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