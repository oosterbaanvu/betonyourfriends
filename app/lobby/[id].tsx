import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import { useStore } from "@/lib/store";
import { mockFriends } from "@/lib/mockData";

const PALETTE = ["#2563EB", "#DB2777", "#059669", "#EA580C", "#7C3AED", "#0891B2", "#CA8A04"];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/**
 * Decorative QR-style block, deterministic from the join code. It's not
 * a scannable QR — when we wire a real one, swap the cell function for
 * a QR encoder. The join code under it is the real entry point.
 */
function CodeGlyph({ code, size = 168 }: { code: string; size?: number }) {
  const cells = 17;
  const cellSize = size / cells;
  const bits = useMemo(() => {
    let h = 0;
    for (let i = 0; i < code.length; i++) h = (h * 16807 + code.charCodeAt(i)) >>> 0;
    const out: boolean[][] = [];
    for (let r = 0; r < cells; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < cells; c++) {
        h = (h * 1103515245 + 12345) >>> 0;
        row.push((h & 1) === 1);
      }
      out.push(row);
    }
    // Corner finder squares to evoke QR — top-left, top-right, bottom-left.
    const draw = (r0: number, c0: number) => {
      for (let r = r0; r < r0 + 7; r++) {
        for (let c = c0; c < c0 + 7; c++) {
          const onEdge = r === r0 || r === r0 + 6 || c === c0 || c === c0 + 6;
          const onInner = r >= r0 + 2 && r <= r0 + 4 && c >= c0 + 2 && c <= c0 + 4;
          out[r][c] = onEdge || onInner;
        }
      }
      // clear the moat
      for (let r = r0 - 1; r <= r0 + 7; r++) {
        for (let c = c0 - 1; c <= c0 + 7; c++) {
          if (r < 0 || r >= cells || c < 0 || c >= cells) continue;
          if (
            r >= r0 &&
            r < r0 + 7 &&
            c >= c0 &&
            c < c0 + 7
          )
            continue;
          out[r][c] = false;
        }
      }
    };
    draw(0, 0);
    draw(0, cells - 7);
    draw(cells - 7, 0);
    return out;
  }, [code]);

  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: colors.chalk,
        borderColor: colors.ink,
        borderWidth: border.brutal,
        padding: 6,
      }}
    >
      <View style={{ flex: 1 }}>
        {bits.map((row, r) => (
          <View key={r} style={{ flexDirection: "row" }}>
            {row.map((on, c) => (
              <View
                key={c}
                style={{
                  width: cellSize - (12 / cells),
                  height: cellSize - (12 / cells),
                  backgroundColor: on ? colors.ink : "transparent",
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function PlayerRow({ userId, isYou, isHost }: { userId: string; isYou: boolean; isHost: boolean }) {
  const friend = mockFriends.find((f) => f.id === userId);
  const handle = friend?.handle ?? userId;
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      friction: 6,
      tension: 130,
      useNativeDriver: true,
    }).start();
  }, [enter]);
  const translateX = enter.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  return (
    <Animated.View
      style={{
        transform: [{ translateX }],
        opacity: enter,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: isYou ? colors.lime : colors.chalk,
        borderColor: colors.ink,
        borderWidth: border.thick,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          backgroundColor: colorFor(userId),
          borderColor: colors.ink,
          borderWidth: border.thick,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text style={{ color: "#FFF", fontWeight: "900", fontSize: 16 }}>
          {handle.replace(/^@/, "")[0]?.toUpperCase() ?? "?"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.ink,
            fontWeight: "900",
            fontSize: 15,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {isYou ? "YOU" : handle}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Courier",
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 1,
          }}
        >
          {isHost ? "HOST" : "JOINED"}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 3,
          backgroundColor: isYou ? colors.ink : colors.lime,
          borderColor: colors.ink,
          borderWidth: 2,
        }}
      >
        <Text
          style={{
            color: isYou ? colors.lime : colors.ink,
            fontFamily: "Courier",
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.2,
          }}
        >
          IN
        </Text>
      </View>
    </Animated.View>
  );
}

function PulseDot() {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(v, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  const bg = v.interpolate({ inputRange: [0, 1], outputRange: [colors.lime, colors.pink] });
  return (
    <Animated.View
      style={{
        width: 10,
        height: 10,
        backgroundColor: bg as any,
        borderColor: colors.ink,
        borderWidth: 2,
        marginRight: 8,
      }}
    />
  );
}

export default function LobbyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { events, viewerId, joinPlayer } = useStore();
  const event = events.find((e) => e.id === id);

  /* Simulate friends joining the lobby over a few seconds. */
  useEffect(() => {
    if (!event) return;
    const others = mockFriends
      .filter((f) => f.id !== viewerId && !event.memberIds.includes(f.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    const timers: ReturnType<typeof setTimeout>[] = [];
    others.forEach((f, i) => {
      const t = setTimeout(
        () => joinPlayer(event.id, f.id),
        1200 + i * (1400 + Math.random() * 900)
      );
      timers.push(t);
    });
    return () => timers.forEach((t) => clearTimeout(t));
    // Intentionally only on mount; subsequent joins via this effect are not desired.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id]);

  if (!event) {
    return (
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bone }}>
        <Text style={{ padding: 20, color: colors.textMuted }}>Game not found.</Text>
      </SafeAreaView>
    );
  }

  const onStart = () => router.replace(`/event/${event.id}`);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bone }}>
      <View
        style={{
          backgroundColor: colors.ink,
          paddingHorizontal: 18,
          paddingTop: 12,
          paddingBottom: 14,
          borderBottomColor: colors.lime,
          borderBottomWidth: border.brutal,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <PulseDot />
            <Text
              style={{
                color: colors.lime,
                fontFamily: "Courier",
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.6,
              }}
            >
              LOBBY
            </Text>
          </View>
          <Pressable
            onPress={() => router.replace("/")}
            hitSlop={8}
          >
            <Ionicons name="close" size={20} color={colors.chalk} />
          </Pressable>
        </View>
        <Text
          style={{
            color: colors.chalk,
            fontSize: 32,
            fontWeight: "900",
            letterSpacing: -1,
            textTransform: "uppercase",
            marginTop: 6,
          }}
        >
          {event.title}
        </Text>
        <Text
          style={{
            color: "#A1A1A1",
            fontFamily: "Courier",
            fontSize: 11,
            fontWeight: "700",
            marginTop: 2,
            letterSpacing: 0.8,
          }}
        >
          WAITING FOR FRIENDS · {event.memberIds.length} IN
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={{ flexDirection: "row", marginBottom: 18 }}>
          <View style={{ marginRight: 16 }}>
            <CodeGlyph code={event.inviteCode} />
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: "Courier",
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.4,
              }}
            >
              JOIN CODE
            </Text>
            <Text
              style={{
                color: colors.ink,
                fontSize: 36,
                fontWeight: "900",
                fontFamily: "Courier",
                letterSpacing: 2,
                marginTop: 2,
              }}
            >
              {event.inviteCode}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: "Courier",
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 0.8,
                marginTop: 6,
              }}
            >
              SCAN OR TYPE TO JOIN
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Courier",
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.6,
            marginBottom: 10,
          }}
        >
          ━ PLAYERS ━━━━━━━━━━━━━
        </Text>

        {event.memberIds.map((mid) => (
          <PlayerRow
            key={mid}
            userId={mid}
            isYou={mid === viewerId}
            isHost={mid === viewerId}
          />
        ))}

        <View style={{ height: 18 }} />

        <Pressable onPress={onStart}>
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
            <View
              style={{
                backgroundColor: colors.lime,
                borderColor: colors.ink,
                borderWidth: border.brutal,
                paddingVertical: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="play" size={18} color={colors.ink} />
              <Text
                style={{
                  marginLeft: 8,
                  color: colors.ink,
                  fontWeight: "900",
                  fontSize: 16,
                  letterSpacing: 1.4,
                }}
              >
                START THE GAME
              </Text>
            </View>
          </View>
        </Pressable>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Courier",
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.6,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          ASKUS PROMPTS WILL START AS SOON AS YOU LAUNCH
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
