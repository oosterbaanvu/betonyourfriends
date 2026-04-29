/**
 * BetOnYourFriends — refined Neo-Brutalist tokens.
 *
 * - Pitch black + bone white surfaces.
 * - Hard-edged borders (1, 3, 5px). No rounded blobs.
 * - Stacked-block drops as a signature, never soft shadows.
 * - Typography is heavy, tight-tracked, and uses mono for numbers.
 * - Pop colors (lime, pink, violet, sun) reserved for energy moments.
 */

export const colors = {
  // surfaces
  ink: "#0A0A0A",
  ash: "#1C1C1C",
  bone: "#F2EEE3",
  chalk: "#FFFFFF",
  paper: "#FAF7EE",

  // text
  text: "#0A0A0A",
  textInvert: "#FFFFFF",
  textMuted: "#5A5A5A",
  textFaint: "#8A8A8A",

  // borders (ink-on-bone is the brutalist default)
  border: "#0A0A0A",
  borderSoft: "#D9D5C8",
  hairline: "#C9C5B8",

  // pop accents
  lime: "#C6FF3D",
  pink: "#FF3D8A",
  violet: "#7A3DFF",
  sun: "#FFD23D",
  blood: "#FF2E2E",
  sky: "#3DB7FF",

  // semantic
  yes: "#16A34A",
  yesFaint: "#DBF4DC",
  no: "#DC2626",
  noFaint: "#FCE4E4",

  // status
  liveBg: "#FF3D8A",
  liveFg: "#FFFFFF",
  openBg: "#C6FF3D",
  openFg: "#0A0A0A",
  warnBg: "#FFD23D",
  warnFg: "#0A0A0A",
  closedBg: "#1C1C1C",
  closedFg: "#FFFFFF",

  // legacy aliases used elsewhere — keep them mapped so we don't cascade-edit
  bg: "#FAF7EE",
  bgSubtle: "#F2EEE3",
  bgInset: "#E8E3D5",
  borderStrong: "#0A0A0A",
  primary: "#0A0A0A",
  primaryFaint: "#E8E3D5",
  liveFaint: "#FFD8E5",
  live: "#FF3D8A",
  warn: "#A86B00",
  warnFaint: "#FFE8B0",
  neutral: "#5A5A5A",
  neutralFaint: "#E8E3D5",
} as const;

export const radius = {
  none: 0,
  nub: 2,
  sm: 4,
  md: 6,
  lg: 8,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const border = {
  hairline: 1,
  thick: 3,
  brutal: 5,
} as const;

export const type = {
  display: {
    fontWeight: "900" as const,
    letterSpacing: -0.6,
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
    letterSpacing: 0.3,
  },
};

export const shadow = {
  /** Stacked-block drop. Pass to a wrapping View as `position` ref point. */
  block: {
    backgroundColor: colors.ink,
  },
};
