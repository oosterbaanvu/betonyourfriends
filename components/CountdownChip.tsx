import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { colors, border } from "@/theme/tokens";

type Props = {
  expiresAt: number;
  /** Override background color (defaults to ink when active, ash when expired). */
  active?: boolean;
};

function format(ms: number): string {
  if (ms <= 0) return "EXPIRED";
  const totalSec = Math.floor(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const totalMin = Math.floor(totalSec / 60);
  if (totalMin < 60) {
    const s = totalSec % 60;
    return `${totalMin}m ${String(s).padStart(2, "0")}s`;
  }
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

/**
 * Live countdown pill. Updates every second. Goes pink in the last minute.
 */
export function CountdownChip({ expiresAt, active = true }: Props) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const remaining = expiresAt - now;
  const danger = remaining > 0 && remaining < 60_000;
  const expired = remaining <= 0;

  const bg = expired ? colors.ash : danger ? colors.pink : active ? colors.ink : colors.bone;
  const fg = expired ? colors.chalk : danger ? colors.ink : colors.lime;

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderColor: colors.ink,
        borderWidth: border.thick,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: fg,
          fontFamily: "Courier",
          fontWeight: "900",
          fontSize: 11,
          letterSpacing: 1.2,
          fontVariant: ["tabular-nums"],
        }}
      >
        {expired ? "LOCKED" : `LOCKS IN ${format(remaining)}`}
      </Text>
    </View>
  );
}
