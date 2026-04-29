import { Text, View } from "react-native";
import { colors, border } from "@/theme/tokens";

type Props = {
  verdict: "GUILTY" | "SQUEAKY CLEAN";
  size?: "sm" | "md" | "lg";
};

/**
 * Rubber-stamp visual. Rotated chunky text inside a thick rectangular frame.
 * Used on the Wall of Shame after a subject confesses or denies.
 */
export function Stamp({ verdict, size = "md" }: Props) {
  const ink = verdict === "GUILTY" ? colors.blood : colors.violet;
  const cfg =
    size === "lg"
      ? { font: 28, padV: 8, padH: 18, borderW: border.brutal, rotate: -8 }
      : size === "sm"
      ? { font: 13, padV: 4, padH: 10, borderW: border.thick, rotate: -10 }
      : { font: 18, padV: 6, padH: 14, borderW: border.brutal, rotate: -10 };

  return (
    <View
      style={{
        alignSelf: "flex-start",
        transform: [{ rotate: `${cfg.rotate}deg` }],
      }}
    >
      <View
        style={{
          borderColor: ink,
          borderWidth: cfg.borderW,
          paddingVertical: cfg.padV,
          paddingHorizontal: cfg.padH,
          backgroundColor: "transparent",
        }}
      >
        <Text
          style={{
            color: ink,
            fontWeight: "900",
            fontSize: cfg.font,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: "Courier",
          }}
        >
          {verdict}
        </Text>
      </View>
    </View>
  );
}
