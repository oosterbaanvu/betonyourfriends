import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";
import { colors } from "@/theme/tokens";

/**
 * Brutalist confetti — chunky squares, hard motion, no soft fade-out.
 * Cheap-and-cheerful so it works on web without a heavy lib.
 */

const PALETTE = [colors.lime, colors.pink, colors.violet, colors.sun, colors.ink];

type Piece = {
  x: number;
  y: Animated.Value;
  rot: Animated.Value;
  size: number;
  color: string;
  drift: number;
};

export function Confetti({ pieces = 36, run = true }: { pieces?: number; run?: boolean }) {
  const items = useRef<Piece[]>([]);
  const { width, height } = Dimensions.get("window");

  if (items.current.length === 0) {
    items.current = Array.from({ length: pieces }).map(() => ({
      x: Math.random() * width,
      y: new Animated.Value(-Math.random() * 200 - 40),
      rot: new Animated.Value(Math.random()),
      size: 8 + Math.floor(Math.random() * 10),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      drift: (Math.random() - 0.5) * 60,
    }));
  }

  useEffect(() => {
    if (!run) return;
    items.current.forEach((p) => {
      p.rot.setValue(0);
      Animated.parallel([
        Animated.timing(p.y, {
          toValue: height + 80,
          duration: 2400 + Math.random() * 1600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(p.rot, {
          toValue: 3 + Math.random() * 3,
          duration: 2400 + Math.random() * 1600,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [run, height]);

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
      {items.current.map((p, i) => {
        const rot = p.rot.interpolate({
          inputRange: [0, 6],
          outputRange: ["0deg", "2160deg"],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              transform: [{ translateY: p.y }, { rotate: rot }, { translateX: p.drift }],
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
          />
        );
      })}
    </View>
  );
}
