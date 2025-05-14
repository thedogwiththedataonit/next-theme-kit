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

export const transitions: Record<TransitionType, TransitionConfig> = {
  radial: {
    name: "Radial",
    type: "radial",
    duration: 300,
    easing: "ease-in-out",
    applyTransition: (element, x, y, maxRadius) => {
      element.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 300,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  radialblur: {
    name: "Radial Blur",
    type: "radialblur",
    duration: 600,
    easing: "ease-in-out",
    applyTransition: (element, x, y, maxRadius) => {
      // First animation: blur the current view
      element.animate(
        {
          filter: [
            "blur(0px) brightness(1)",
            "blur(12px) brightness(1.2)",
          ],
          transform: [
            "scale(1)",
            "scale(1.02)",
          ],
        },
        {
          duration: 300,
          easing: "ease-in",
          pseudoElement: "::view-transition-old(root)",
        }
      )

      // Second animation: unblur the new view
      element.animate(
        {
          filter: [
            "blur(12px) brightness(1.2)",
            "blur(0px) brightness(1)",
          ],
          transform: [
            "scale(1.02)",
            "scale(1)",
          ],
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 300,
          easing: "ease-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  fade: {
    name: "Fade",
    type: "fade",
    duration: 200,
    easing: "ease-in-out",
    applyTransition: (element, x, y, maxRadius) => {
      element.animate(
        {
          opacity: [0, 1],
          transform: ["scale(0.95)", "scale(1)"],
        },
        {
          duration: 200,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  morph: {
    name: "Morph",
    type: "morph",
    duration: 800,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      element.animate(
        {
          clipPath: [
            `polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)`,
            `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`,
          ],
          filter: [
            "blur(0px) saturate(1)",
            "blur(8px) saturate(1.2)",
            "blur(0px) saturate(1)",
          ],
        },
        {
          duration: 800,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  wave: {
    name: "Wave",
    type: "wave",
    duration: 1200,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      // First wave
      element.animate(
        {
          filter: [
            "blur(0px) brightness(1)",
            "blur(4px) brightness(1.1)",
          ],
          transform: [
            "translateY(0)",
            "translateY(-10px)",
          ],
        },
        {
          duration: 400,
          easing: "ease-in",
          pseudoElement: "::view-transition-old(root)",
        }
      )

      // Second wave
      element.animate(
        {
          filter: [
            "blur(4px) brightness(1.1)",
            "blur(0px) brightness(1)",
          ],
          transform: [
            "translateY(10px)",
            "translateY(0)",
          ],
          clipPath: [
            `polygon(0 0, 100% 0, 100% 0%, 0 0%)`,
            `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
          ],
        },
        {
          duration: 800,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  glitch: {
    name: "Glitch",
    type: "glitch",
    duration: 600,
    easing: "steps(6)",
    applyTransition: (element, x, y, maxRadius) => {
      const glitchFrames = [
        { clip: "inset(0 0 0 0)", transform: "translate(0)", filter: "hue-rotate(0deg)" },
        { clip: "inset(10% -10% 90% 10%)", transform: "translate(-5px, 5px)", filter: "hue-rotate(90deg)" },
        { clip: "inset(-10% 10% 110% -10%)", transform: "translate(5px, -5px)", filter: "hue-rotate(180deg)" },
        { clip: "inset(20% -20% 80% 20%)", transform: "translate(-8px, 8px)", filter: "hue-rotate(270deg)" },
        { clip: "inset(-20% 20% 120% -20%)", transform: "translate(8px, -8px)", filter: "hue-rotate(360deg)" },
        { clip: "inset(0 0 0 0)", transform: "translate(0)", filter: "hue-rotate(0deg)" },
      ]

      element.animate(
        glitchFrames.map(frame => ({
          clipPath: frame.clip,
          transform: frame.transform,
          filter: frame.filter,
        })),
        {
          duration: 600,
          easing: "steps(6)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  zoom: {
    name: "Zoom",
    type: "zoom",
    duration: 700,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      // Calculate the center point of the dropdown
      const dropdownX = x
      const dropdownY = y

      element.animate(
        {
          transform: [
            `scale(1) translate(${dropdownX}px, ${dropdownY}px)`,
            `scale(0) translate(${dropdownX}px, ${dropdownY}px)`,
            `scale(1) translate(0, 0)`,
          ],
          filter: [
            "blur(0px)",
            "blur(8px)",
            "blur(0px)",
          ],
          opacity: [1, 0.5, 1],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  slide: {
    name: "Slide",
    type: "slide",
    duration: 500,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      element.animate(
        {
          transform: [
            "translateX(-100%)",
            "translateX(0)",
          ],
          opacity: [0, 1],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  rotate: {
    name: "Rotate",
    type: "rotate",
    duration: 800,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      element.animate(
        {
          transform: [
            `rotate(0deg) scale(1)`,
            `rotate(360deg) scale(0)`,
            `rotate(720deg) scale(1)`,
          ],
          filter: [
            "blur(0px)",
            "blur(4px)",
            "blur(0px)",
          ],
        },
        {
          duration: 800,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  ripple: {
    name: "Ripple",
    type: "ripple",
    duration: 900,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      element.animate(
        {
          clipPath: [
            `circle(0% at ${x}px ${y}px)`,
            `circle(150% at ${x}px ${y}px)`,
          ],
          transform: [
            "scale(0.8)",
            "scale(1)",
          ],
          filter: [
            "blur(8px)",
            "blur(0px)",
          ],
        },
        {
          duration: 900,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  neon: {
    name: "Neon",
    type: "neon",
    duration: 600,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      element.animate(
        {
          filter: [
            "brightness(1) contrast(1)",
            "brightness(1.5) contrast(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.8))",
            "brightness(1) contrast(1)",
          ],
          transform: [
            "scale(1)",
            "scale(1.05)",
            "scale(1)",
          ],
        },
        {
          duration: 600,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  matrix: {
    name: "Matrix",
    type: "matrix",
    duration: 500,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      element.animate(
        {
          clipPath: [
            `polygon(0 0, 100% 0, 100% 0, 0 0)`,
            `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
          ],
          filter: [
            "blur(0px) brightness(1) hue-rotate(0deg)",
            "blur(2px) brightness(1.1) hue-rotate(45deg)",
            "blur(0px) brightness(1) hue-rotate(0deg)",
          ],
          transform: [
            "scale(1)",
            "scale(1.02)",
            "scale(1)",
          ],
        },
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
  verci: {
    name: "Verci",
    type: "verci",
    duration: 1000,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applyTransition: (element, x, y, maxRadius) => {
      // First, blur the entire page
      element.animate(
        {
          filter: [
            "blur(0px)",
            "blur(12px)",
          ],
        },
        {
          duration: 300,
          easing: "ease-in",
          pseudoElement: "::view-transition-old(root)",
        }
      )

      // Create a smooth top-to-bottom reveal
      element.animate(
        {
          clipPath: [
            "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
            "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          ],
          filter: [
            "blur(12px)",
            "blur(0px)",
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
  },
} 