import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/tokens";

type Props = { startsInMinutes: number; status: string };

function formatRemaining(minutes: number): string {
  if (minutes <= 0) {
    const elapsed = -minutes;
    if (elapsed < 60) return `LIVE, ${Math.floor(elapsed)}M IN`;
    const h = Math.floor(elapsed / 60);
    return `LIVE, ${h}H ${Math.floor(elapsed % 60)}M IN`;
  }
  if (minutes < 60) return `STARTS IN ${Math.floor(minutes)}M`;
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `STARTS IN ${h}H ${m}M`;
}

export function Countdown({ startsInMinutes, status }: Props) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  const drift = -tick * 0.5;
  const adjusted = startsInMinutes + drift;
  const isLive = status === "LIVE" || status === "RESOLVING";

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons
        name={isLive ? "radio" : "time"}
        size={13}
        color={isLive ? colors.blood : colors.ink}
        style={{ marginRight: 5 }}
      />
      <Text
        style={{
          color: colors.ink,
          fontSize: 11,
          fontWeight: "900",
          fontFamily: "Courier",
          letterSpacing: 1,
        }}
      >
        {formatRemaining(adjusted)}
      </Text>
    </View>
  );
}
