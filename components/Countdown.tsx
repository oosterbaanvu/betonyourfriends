import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { colors } from "@/theme/tokens";

type Props = { startsInMinutes: number; status: string };

function formatRemaining(minutes: number): string {
  if (minutes <= 0) {
    const elapsed = -minutes;
    if (elapsed < 60) return `Live · ${Math.floor(elapsed)}m in`;
    const h = Math.floor(elapsed / 60);
    return `Live · ${h}h ${Math.floor(elapsed % 60)}m in`;
  }
  if (minutes < 60) return `Starts in ${Math.floor(minutes)}m`;
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `Starts in ${h}h ${m}m`;
}

export function Countdown({ startsInMinutes, status }: Props) {
  // Tick every 30s so the demo feels live without burning CPU.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const drift = -tick * 0.5; // each tick = 30s = 0.5min
  const adjusted = startsInMinutes + drift;
  const isLive = status === "LIVE" || status === "RESOLVING";

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: isLive ? colors.live : colors.primary,
          marginRight: 6,
        }}
      />
      <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "600" }}>
        {formatRemaining(adjusted)}
      </Text>
    </View>
  );
}
