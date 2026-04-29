import { Pressable, Text, View, GestureResponderEvent } from "react-native";
import { useState } from "react";
import { colors, border, radius } from "@/theme/tokens";

type Variant = "primary" | "secondary" | "yes" | "no" | "ghost" | "danger";

type Props = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  trailing?: string;
  bg?: keyof typeof colors;
  fg?: keyof typeof colors;
  offset?: number;
};

const variantBgFg: Record<Variant, { bg: keyof typeof colors; fg: keyof typeof colors }> = {
  primary: { bg: "ink", fg: "chalk" },
  secondary: { bg: "chalk", fg: "ink" },
  yes: { bg: "lime", fg: "ink" },
  no: { bg: "blood", fg: "chalk" },
  ghost: { bg: "bone", fg: "ink" },
  danger: { bg: "blood", fg: "chalk" },
};

const sizeStyle = {
  sm: { paddingV: 8, paddingH: 12, font: 13 },
  md: { paddingV: 12, paddingH: 16, font: 15 },
  lg: { paddingV: 16, paddingH: 20, font: 17 },
};

/**
 * Stomp-button: pressing visually slides the colored face into its black
 * drop-block. No soft shadow, no border radius.
 */
export function BrutalButton({
  label,
  onPress,
  variant = "primary",
  fullWidth,
  size = "md",
  trailing,
  bg,
  fg,
  offset = 5,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const v = variantBgFg[variant];
  const s = sizeStyle[size];
  const shift = pressed ? offset : 0;
  const finalBg = bg ?? v.bg;
  const finalFg = fg ?? v.fg;

  return (
    <View
      style={{
        position: "relative",
        marginRight: offset,
        marginBottom: offset + 4,
        alignSelf: fullWidth ? "stretch" : "flex-start",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: offset,
          left: offset,
          right: -offset,
          bottom: -offset,
          backgroundColor: colors.ink,
        }}
      />
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{
          backgroundColor: colors[finalBg],
          borderColor: colors.ink,
          borderWidth: border.brutal,
          borderRadius: radius.none,
          paddingVertical: s.paddingV,
          paddingHorizontal: s.paddingH,
          transform: [{ translateX: shift }, { translateY: shift }],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: trailing ? "space-between" : "center",
        }}
      >
        <Text
          style={{
            color: colors[finalFg],
            fontWeight: "900",
            fontSize: s.font,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {label}
        </Text>
        {trailing ? (
          <Text
            style={{
              color: colors[finalFg],
              fontWeight: "900",
              fontSize: s.font,
              fontVariant: ["tabular-nums"],
            }}
          >
            {trailing}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}
