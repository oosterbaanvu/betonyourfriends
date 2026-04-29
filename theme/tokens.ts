/**
 * BetOnYourFriends — Playful Neo-Brutalist design tokens.
 * Hard edges, thick borders, aggressive pops, no soft shadows.
 */

export const colors = {
  ink: "#0A0A0A",
  ash: "#1C1C1C",
  bone: "#F5F1E8",
  chalk: "#FFFFFF",
  lime: "#C6FF3D",
  pink: "#FF3D8A",
  violet: "#7A3DFF",
  sun: "#FFD23D",
  danger: "#FF2E2E",
} as const;

export const border = {
  hairline: 1,
  thick: 3,
  brutal: 5,
} as const;

export const radius = {
  none: 0,
  nub: 4,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const type = {
  display: {
    fontWeight: "900" as const,
    letterSpacing: -0.5,
  },
  heading: {
    fontWeight: "800" as const,
    letterSpacing: -0.3,
  },
  body: {
    fontWeight: "600" as const,
  },
  mono: {
    fontFamily: "Courier",
    fontWeight: "700" as const,
  },
};
