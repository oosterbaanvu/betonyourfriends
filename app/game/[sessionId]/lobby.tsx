import { useEffect, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Animated, Easing, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import { useGameSession } from "@/lib/gameSession";
import { BrutalButton } from "@/components/BrutalButton";
import { getChallengePack } from "@/lib/challengePacks";
import { mockEvents } from "@/lib/mockData";

const PALETTE = ["#2563EB", "#DB2777", "#059669", "#EA580C", "#7C3AED", "#0891B2", "#CA8A04"];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
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
        width: 12,
        height: 12,
        backgroundColor: bg as any,
        borderColor: colors.ink,
        borderWidth: 2,
        marginRight: 8,
      }}
    />
  );
}

export default function LobbyScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const { session, advancePhase, resetSession } = useGameSession();

  useEffect(() => {
    if (!session || session.id !== sessionId) {
      router.replace("/");
    }
  }, [session, sessionId, router]);

  useEffect(() => {
    if (!session) return;
    if (session.phase !== "LOBBY") {
      router.replace(`/game/${session.id}/play`);
    }
  }, [session, router]);

  if (!session) return null;
  const pack = getChallengePack(session.packId);
  const event = mockEvents.find((e) => e.id === session.eventId);

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
            onPress={() => {
              resetSession();
              router.replace("/");
            }}
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
          PARTY MODE
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
          {pack?.label.toUpperCase()} · {session.rounds.length} ROUNDS
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Invite code slab */}
        <View
          style={{
            position: "relative",
            marginRight: 6,
            marginBottom: 18,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              right: -6,
              bottom: -6,
              backgroundColor: colors.ink,
            }}
          />
          <View
            style={{
              backgroundColor: colors.lime,
              borderColor: colors.ink,
              borderWidth: border.brutal,
              padding: 18,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.ink,
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
                fontSize: 44,
                fontWeight: "900",
                fontFamily: "Courier",
                letterSpacing: 3,
                marginTop: 4,
              }}
            >
              {event?.inviteCode ?? sessionId.slice(-7).toUpperCase()}
            </Text>
            <Text
              style={{
                color: colors.ink,
                fontFamily: "Courier",
                fontSize: 11,
                fontWeight: "700",
                letterSpacing: 1,
                marginTop: 4,
                opacity: 0.7,
              }}
            >
              FRIENDS TYPE THIS TO JOIN
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 11,
            fontWeight: "900",
            color: colors.textMuted,
            letterSpacing: 1.6,
            fontFamily: "Courier",
            marginBottom: 10,
          }}
        >
          ━ PLAYERS ━━━━━━━━━━━━━━
        </Text>

        {session.players.map((p) => (
          <View
            key={p.userId}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.chalk,
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
                backgroundColor: colorFor(p.userId),
                borderColor: colors.ink,
                borderWidth: border.thick,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>
                {p.handle.replace(/^@/, "")[0]?.toUpperCase() ?? "?"}
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
                {p.handle}
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
                {p.userId === session.hostId ? "HOST" : p.isBot ? "READY · BOT" : "READY"}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: colors.lime,
                borderColor: colors.ink,
                borderWidth: 2,
              }}
            >
              <Text
                style={{
                  color: colors.ink,
                  fontFamily: "Courier",
                  fontSize: 10,
                  fontWeight: "900",
                  letterSpacing: 1.2,
                }}
              >
                IN
              </Text>
            </View>
          </View>
        ))}

        <View style={{ height: 12 }} />
        <BrutalButton
          label="START GAME"
          fullWidth
          size="lg"
          variant="yes"
          onPress={() => advancePhase()}
        />
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Courier",
            fontSize: 10,
            fontWeight: "700",
            letterSpacing: 1,
            marginTop: 6,
            textAlign: "center",
          }}
        >
          BOTS WILL PLAY ALONG FOR THE DEMO
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
