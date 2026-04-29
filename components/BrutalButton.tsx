import { Pressable, Text, View, GestureResponderEvent } from "react-native";
import { colors, radius } from "@/theme/tokens";

type Variant = "primary" | "secondary" | "yes" | "no" | "ghost";

type Props = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  trailing?: string; // optional right-aligned price/percent
};

const variantStyle: Record<
  Variant,
  { bg: string; fg: string; border?: string }
> = {
  primary: { bg: colors.text, fg: "#FFFFFF" },
  secondary: { bg: colors.bg, fg: colors.text, border: colors.borderStrong },
  yes: { bg: colors.yesFaint, fg: colors.yes, border: colors.yesFaint },
  no: { bg: colors.noFaint, fg: colors.no, border: colors.noFaint },
  ghost: { bg: "transparent", fg: colors.text },
};

const sizeStyle = {
  sm: { paddingV: 8, paddingH: 12, font: 13 },
  md: { paddingV: 12, paddingH: 16, font: 15 },
  lg: { paddingV: 14, paddingH: 18, font: 16 },
};

export function BrutalButton({
  label,
  onPress,
  variant = "primary",
  fullWidth,
  size = "md",
  trailing,
}: Props) {
  const v = variantStyle[variant];
  const s = sizeStyle[size];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: v.bg,
        borderRadius: radius.md,
        borderWidth: v.border ? 1 : 0,
        borderColor: v.border,
        paddingVertical: s.paddingV,
        paddingHorizontal: s.paddingH,
        alignSelf: fullWidth ? "stretch" : "flex-start",
        opacity: pressed ? 0.85 : 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: trailing ? "space-between" : "center",
      })}
    >
      <Text
        style={{
          color: v.fg,
          fontWeight: "600",
          fontSize: s.font,
          letterSpacing: 0.1,
        }}
      >
        {label}
      </Text>
      {trailing ? (
        <Text
          style={{
            color: v.fg,
            fontWeight: "700",
            fontSize: s.font,
            fontVariant: ["tabular-nums"],
          }}
        >
          {trailing}
        </Text>
      ) : null}
    </Pressable>
  );
}
