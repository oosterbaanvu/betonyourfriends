/**
 * BetOnYourFriends — clean, Polymarket-inspired tokens.
 * Light surface, 1px gray borders, color reserved for Yes/No semantics.
 */

export const colors = {
  // surfaces
  bg: "#FFFFFF",
  bgSubtle: "#F7F8FA",
  bgInset: "#F0F2F5",

  // borders
  border: "#E5E7EB",
  borderStrong: "#D1D5DB",

  // text
  text: "#0F172A",
  textMuted: "#6B7280",
  textFaint: "#9CA3AF",

  // brand / actions
  primary: "#2563EB",
  primaryFaint: "#EFF4FF",

  // semantic
  yes: "#10B981",
  yesFaint: "#E7F8F1",
  no: "#EF4444",
  noFaint: "#FEECEC",

  // status
  live: "#DC2626",
  liveFaint: "#FEECEC",
  warn: "#F59E0B",
  warnFaint: "#FEF4E0",
  neutral: "#6B7280",
  neutralFaint: "#F0F2F5",
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
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

export const type = {
  display: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.4 },
  h1: { fontSize: 20, fontWeight: "700" as const, letterSpacing: -0.3 },
  h2: { fontSize: 17, fontWeight: "600" as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: "500" as const },
  bodyMuted: { fontSize: 14, fontWeight: "500" as const, color: colors.textMuted },
  caption: { fontSize: 12, fontWeight: "500" as const, color: colors.textMuted },
  num: { fontSize: 18, fontWeight: "700" as const, fontVariant: ["tabular-nums" as const] },
};

export const shadow = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
};
