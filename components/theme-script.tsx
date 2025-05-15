"use client";

import { themes } from "@/lib/themes"; // Import themes to embed them in the script

export function ThemeScript() {
  // Prepare a subset of theme data for the script to avoid stringifying functions or complex objects if any.
  // In this case, the themes structure is already serializable.
  const serializableThemes = themes.map(t => ({
    name: t.name,
    light: {
      colors: t.light.colors,
      fonts: t.light.fonts,
      radius: t.light.radius,
      // shadows: t.light.shadows, // Shadows might be complex; only include if simple strings
    },
    dark: {
      colors: t.dark.colors,
      fonts: t.dark.fonts,
      radius: t.dark.radius,
      // shadows: t.dark.shadows, // Shadows might be complex; only include if simple strings
    }
  }));

  const scriptContent = `
    (function() {
      const THEMES_STORAGE_KEY = "theme";
      const MODE_STORAGE_KEY = "mode";
      const defaultThemeName = "default"; // Fallback theme name
      const defaultMode = "light";     // Fallback mode

      const root = document.documentElement;
      const embeddedThemes = ${JSON.stringify(serializableThemes)};

      let currentThemeName = defaultThemeName;
      let currentMode = defaultMode;
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

      try {
        const storedThemeName = localStorage.getItem(THEMES_STORAGE_KEY);
        const storedMode = localStorage.getItem(MODE_STORAGE_KEY);
        console.log(storedThemeName, storedMode)

        if (storedThemeName) {
          currentThemeName = storedThemeName;
        }
        if (storedMode === "light" || storedMode === "dark") {
          currentMode = storedMode;
        } else if (prefersDark) {
          currentMode = "dark";
        } // Else it remains defaultMode (e.g. "light")
      } catch (e) {
        console.warn("ThemeScript: Failed to read from localStorage:", e);
      }

      const themeToApply = embeddedThemes.find(t => t.name === currentThemeName) || embeddedThemes.find(t => t.name === defaultThemeName);

      if (themeToApply) {
        const themeVariant = currentMode === "dark" ? themeToApply.dark : themeToApply.light;

        root.classList.remove(...embeddedThemes.map(t => t.name)); // Remove any existing theme classes
        root.classList.add(currentThemeName);

        if (currentMode === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }

        if (themeVariant) {
          // Apply colors
          if (themeVariant.colors) {
            for (const key in themeVariant.colors) {
              root.style.setProperty(\`--\${key}\`, themeVariant.colors[key]);
            }
          }
          // Apply fonts
          if (themeVariant.fonts) {
            for (const key in themeVariant.fonts) {
              root.style.setProperty(\`--font-\${key}\`, themeVariant.fonts[key]);
            }
          }
          // Apply radius
          if (themeVariant.radius) {
             root.style.setProperty("--radius", themeVariant.radius);
          }
          // Note: Shadows are not applied here as they were commented out.
          // If shadows are simple string key-value pairs, they can be added similarly.
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