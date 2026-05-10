import { Animated, Pressable, Text, View, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { colors, border } from "@/theme/tokens";
import { SessionPlayer } from "@/lib/gameSession";

type Props = {
  players: SessionPlayer[];
  viewerId: string;
  myPick: string | null;
  /** Set of voterIds that have locked in (for ticker count, not for reveal). */
  lockedVoters: Set<string>;
  onPick: (targetId: string) => void;
  disabled?: boolean;
};

const PALETTE = ["#2563EB", "#DB2777", "#059669", "#EA580C", "#7C3AED", "#0891B2", "#CA8A04"];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function FaceTile({
  player,
  isSelf,
  selected,
  onPress,
  disabled,
}: {
  player: SessionPlayer;
  isSelf: boolean;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(shift, {
      toValue: selected ? 1 : 0,
      duration: 140,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selected, shift]);

  const t = shift.interpolate({ inputRange: [0, 1], outputRange: [0, 5] });

  return (
    <View style={{ width: "33.333%", padding: 4 }}>
      <Pressable onPress={disabled ? undefined : onPress}>
        <View style={{ position: "relative", marginRight: 5, marginBottom: 5 }}>
          <View
            style={{
              position: "absolute",
              top: 5,
              left: 5,
              right: -5,
              bottom: -5,
              backgroundColor: colors.ink,
            }}
          />
          <Animated.View
            style={{
              transform: [{ translateX: t }, { translateY: t }],
              backgroundColor: selected ? colors.lime : colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.brutal,
              padding: 10,
              minHeight: 110,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                backgroundColor: colorFor(player.userId),
                borderColor: colors.ink,
                borderWidth: border.thick,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "900",
                  fontSize: 20,
                }}
              >
                {player.handle.replace(/^@/, "")[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: colors.ink,
                fontWeight: "900",
                fontSize: 12,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              {isSelf ? "ME" : player.handle}
            </Text>
            {selected ? (
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  transform: [{ rotate: "-12deg" }],
                  backgroundColor: colors.ink,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    color: colors.lime,
                    fontFamily: "Courier",
                    fontSize: 9,
                    fontWeight: "900",
                    letterSpacing: 1.2,
                  }}
                >
                  LOCKED
                </Text>
              </View>
            ) : null}
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

export function VoteGrid({
  players,
  viewerId,
  myPick,
  lockedVoters,
  onPick,
  disabled,
}: Props) {
  return (
    <View>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {players.map((p) => (
          <FaceTile
            key={p.userId}
            player={p}
            isSelf={p.userId === viewerId}
            selected={myPick === p.userId}
            onPress={() => onPick(p.userId)}
            disabled={disabled}
          />
        ))}
      </View>
      <View
        style={{
          marginTop: 8,
          backgroundColor: colors.ink,
          paddingVertical: 8,
          paddingHorizontal: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: 5,
        }}
      >
        <Text
          style={{
            color: colors.chalk,
            fontFamily: "Courier",
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.4,
          }}
        >
          LOCKED IN
        </Text>
        <Text
          style={{
            color: colors.lime,
            fontSize: 16,
            fontWeight: "900",
            fontVariant: ["tabular-nums"],
          }}
        >
          {lockedVoters.size} / {players.length}
        </Text>
      </View>
    </View>
  );
}
