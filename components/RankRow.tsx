import { Text, View } from "react-native";
import { colors, border } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { SessionPlayer } from "@/lib/gameSession";

type Props = {
  rank: number;
  player: SessionPlayer;
  delta?: number;
  highlight?: boolean;
};

export function RankRow({ rank, player, delta, highlight }: Props) {
  const crown = rank === 1;
  const skull = false; // reserved for final-screen visual
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: highlight ? colors.lime : colors.chalk,
        borderColor: colors.ink,
        borderWidth: border.thick,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          backgroundColor: crown ? colors.sun : colors.bone,
          borderColor: colors.ink,
          borderWidth: border.thick,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        {crown ? (
          <Ionicons name="trophy" size={16} color={colors.ink} />
        ) : (
          <Text
            style={{
              color: colors.ink,
              fontFamily: "Courier",
              fontWeight: "900",
              fontSize: 14,
            }}
          >
            {rank}
          </Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.ink,
            fontWeight: "900",
            fontSize: 15,
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
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 0.8,
            opacity: 0.7,
          }}
        >
          {player.prophetHits} HITS{player.streak >= 2 ? `  ·  STREAK x${player.streak}` : ""}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            color: colors.ink,
            fontSize: 22,
            fontWeight: "900",
            fontVariant: ["tabular-nums"],
            letterSpacing: -0.6,
          }}
        >
          {player.score}
        </Text>
        {delta && delta !== 0 ? (
          <Text
            style={{
              color: delta > 0 ? colors.yes : colors.blood,
              fontFamily: "Courier",
              fontSize: 11,
              fontWeight: "900",
            }}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
