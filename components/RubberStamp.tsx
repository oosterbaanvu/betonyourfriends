import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { colors, border } from "@/theme/tokens";
import { Stamp as StampKind } from "@/lib/scoring";

type Props = {
  stamp: StampKind;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
};

const META: Record<
  StampKind,
  { label: string; ink: keyof typeof colors; rotate: number }
> = {
  PROPHET: { label: "PROPHET", ink: "lime", rotate: -8 },
  SELF_AWARE: { label: "SELF-AWARE", ink: "sun", rotate: -6 },
  DELUSIONAL: { label: "DELUSIONAL", ink: "violet", rotate: 7 },
  CLOSE_READ: { label: "CLOSE READ", ink: "sky", rotate: -5 },
  AFK: { label: "AFK", ink: "textMuted", rotate: 10 },
  GROUPTHINK: { label: "GROUPTHINK", ink: "pink", rotate: -10 },
};

export function RubberStamp({ stamp, size = "md", animate = true }: Props) {
  const m = META[stamp];
  const ink = colors[m.ink];

  const cfg =
    size === "lg"
      ? { font: 26, padV: 8, padH: 18, borderW: border.brutal }
      : size === "sm"
      ? { font: 11, padV: 3, padH: 8, borderW: border.thick }
      : { font: 16, padV: 5, padH: 12, borderW: border.thick };

  const slam = useRef(new Animated.Value(animate ? 0 : 1)).current;
  useEffect(() => {
    if (!animate) return;
    slam.setValue(0);
    Animated.sequence([
      Animated.timing(slam, {
        toValue: 1.15,
        duration: 220,
        easing: Easing.out(Easing.back(3)),
        useNativeDriver: true,
      }),
      Animated.timing(slam, {
        toValue: 1,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animate, stamp, slam]);

  return (
    <Animated.View
      style={{
        alignSelf: "flex-start",
        transform: [{ rotate: `${m.rotate}deg` }, { scale: slam }],
      }}
    >
      <View
        style={{
          borderColor: ink,
          borderWidth: cfg.borderW,
          paddingVertical: cfg.padV,
          paddingHorizontal: cfg.padH,
        }}
      >
        <Text
          style={{
            color: ink,
            fontFamily: "Courier",
            fontWeight: "900",
            fontSize: cfg.font,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {m.label}
        </Text>
      </View>
    </Animated.View>
  );
}
