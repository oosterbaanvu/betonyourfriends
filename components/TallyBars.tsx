import { Animated, Easing, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { colors, border } from "@/theme/tokens";
import { SessionPlayer } from "@/lib/gameSession";

type Props = {
  players: SessionPlayer[];
  tally: Record<string, number>;
  pluralityTargetIds: string[];
};

export function TallyBars({ players, tally, pluralityTargetIds }: Props) {
  const ordered = players
    .map((p) => ({ player: p, count: tally[p.userId] ?? 0 }))
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...ordered.map((o) => o.count));

  return (
    <View>
      {ordered.map((o, i) => (
        <TallyRow
          key={o.player.userId}
          player={o.player}
          count={o.count}
          max={max}
          delayMs={i * 220}
          winner={pluralityTargetIds.includes(o.player.userId) && o.count > 0}
        />
      ))}
    </View>
  );
}

function TallyRow({
  player,
  count,
  max,
  delayMs,
  winner,
}: {
  player: SessionPlayer;
  count: number;
  max: number;
  delayMs: number;
  winner: boolean;
}) {
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const target = count / max;
    Animated.timing(fill, {
      toValue: target,
      duration: 700,
      delay: delayMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [count, max, delayMs, fill]);

  const widthPct = fill.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={{ marginBottom: 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <Text
          style={{
            color: colors.ink,
            fontWeight: "900",
            fontSize: 13,
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          {player.handle}
        </Text>
        <Text
          style={{
            color: colors.ink,
            fontFamily: "Courier",
            fontWeight: "900",
            fontSize: 13,
            fontVariant: ["tabular-nums"],
          }}
        >
          {count} VOTE{count === 1 ? "" : "S"}
        </Text>
      </View>
      <View
        style={{
          height: 22,
          backgroundColor: colors.chalk,
          borderColor: colors.ink,
          borderWidth: border.thick,
        }}
      >
        <Animated.View
          style={{
            width: widthPct,
            height: "100%",
            backgroundColor: winner ? colors.lime : colors.ink,
          }}
        />
      </View>
    </View>
  );
}
