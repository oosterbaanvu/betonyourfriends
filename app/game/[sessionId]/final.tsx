import { useEffect, useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import { useGameSession } from "@/lib/gameSession";
import { CURRENT_USER_ID } from "@/lib/mockData";
import { RankRow } from "@/components/RankRow";
import { Confetti } from "@/components/Confetti";
import { RubberStamp } from "@/components/RubberStamp";
import { BrutalButton } from "@/components/BrutalButton";
import { tierFor } from "@/lib/scoring";

export default function FinalScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const { session, resetSession } = useGameSession();

  useEffect(() => {
    if (!session || session.id !== sessionId) {
      router.replace("/");
    }
  }, [session, sessionId, router]);

  const ranked = useMemo(() => {
    if (!session) return [];
    return session.players.slice().sort((a, b) => b.score - a.score);
  }, [session]);

  if (!session) return null;

  const winner = ranked[0];
  const loser = ranked[ranked.length - 1];
  const me = session.players.find((p) => p.userId === CURRENT_USER_ID);
  const myRank = ranked.findIndex((p) => p.userId === CURRENT_USER_ID) + 1;
  const tier = me ? tierFor(me.prophetHits) : "ROOKIE";

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.ink }}>
      <Confetti pieces={48} run />
      <View
        style={{
          paddingHorizontal: 18,
          paddingTop: 12,
          paddingBottom: 14,
          borderBottomColor: colors.lime,
          borderBottomWidth: border.brutal,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.lime,
            fontFamily: "Courier",
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.6,
          }}
        >
          FINAL · {session.rounds.length} ROUNDS
        </Text>
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

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
        <Text
          style={{
            color: colors.chalk,
            fontSize: 38,
            fontWeight: "900",
            letterSpacing: -1.4,
            textTransform: "uppercase",
            lineHeight: 40,
          }}
        >
          Prophet of{`\n`}the Night
        </Text>

        {/* Winner slab */}
        <View style={{ position: "relative", marginRight: 6, marginTop: 16, marginBottom: 22 }}>
          <View
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              right: -6,
              bottom: -6,
              backgroundColor: colors.pink,
            }}
          />
          <View
            style={{
              backgroundColor: colors.lime,
              borderColor: colors.ink,
              borderWidth: border.brutal,
              padding: 22,
            }}
          >
            <Text
              style={{
                color: colors.ink,
                fontFamily: "Courier",
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.6,
              }}
            >
              WINNER
            </Text>
            <Text
              style={{
                color: colors.ink,
                fontSize: 56,
                fontWeight: "900",
                letterSpacing: -2,
                lineHeight: 58,
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              {winner.handle}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.ink,
                    fontFamily: "Courier",
                    fontSize: 10,
                    fontWeight: "900",
                    letterSpacing: 1.4,
                  }}
                >
                  SCORE
                </Text>
                <Text
                  style={{
                    color: colors.ink,
                    fontSize: 40,
                    fontWeight: "900",
                    fontVariant: ["tabular-nums"],
                    letterSpacing: -1.5,
                    lineHeight: 42,
                  }}
                >
                  {winner.score}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.ink,
                    fontFamily: "Courier",
                    fontSize: 10,
                    fontWeight: "900",
                    letterSpacing: 1.4,
                  }}
                >
                  HITS
                </Text>
                <Text
                  style={{
                    color: colors.ink,
                    fontSize: 40,
                    fontWeight: "900",
                    fontVariant: ["tabular-nums"],
                    letterSpacing: -1.5,
                    lineHeight: 42,
                  }}
                >
                  {winner.prophetHits}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Your card */}
        {me ? (
          <View
            style={{
              backgroundColor: colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.brutal,
              padding: 16,
              marginBottom: 18,
              marginRight: 5,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: "Courier",
                    fontSize: 10,
                    fontWeight: "900",
                    letterSpacing: 1.4,
                  }}
                >
                  YOU FINISHED
                </Text>
                <Text
                  style={{
                    color: colors.ink,
                    fontSize: 30,
                    fontWeight: "900",
                    letterSpacing: -0.6,
                  }}
                >
                  #{myRank} · {me.score} PTS
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: "Courier",
                    fontSize: 11,
                    fontWeight: "700",
                    marginTop: 2,
                    letterSpacing: 0.6,
                  }}
                >
                  {me.prophetHits} PROPHET HITS · TIER {tier}
                </Text>
              </View>
              <RubberStamp
                stamp={
                  myRank === 1
                    ? "PROPHET"
                    : myRank === ranked.length
                    ? "DELUSIONAL"
                    : "CLOSE_READ"
                }
                size="md"
              />
            </View>
          </View>
        ) : null}

        <Text
          style={{
            color: colors.lime,
            fontFamily: "Courier",
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.6,
            marginBottom: 10,
          }}
        >
          ━ STANDINGS ━━━━━━━━━━
        </Text>
        {ranked.map((p, i) => (
          <RankRow
            key={p.userId}
            rank={i + 1}
            player={p}
            highlight={p.userId === CURRENT_USER_ID}
          />
        ))}

        <View
          style={{
            marginTop: 14,
            backgroundColor: colors.pink,
            borderColor: colors.ink,
            borderWidth: border.brutal,
            padding: 14,
            marginRight: 5,
          }}
        >
          <Text
            style={{
              color: colors.ink,
              fontFamily: "Courier",
              fontSize: 10,
              fontWeight: "900",
              letterSpacing: 1.4,
            }}
          >
            BOTTOM FEEDER
          </Text>
          <Text
            style={{
              color: colors.ink,
              fontSize: 24,
              fontWeight: "900",
              letterSpacing: -0.4,
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {loser.handle}
          </Text>
        </View>

        <View style={{ height: 18 }} />
        <BrutalButton
          label="DONE"
          fullWidth
          size="lg"
          variant="primary"
          onPress={() => {
            resetSession();
            router.replace("/");
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
