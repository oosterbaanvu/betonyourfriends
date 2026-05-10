import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Animated, Easing, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import { useGameSession } from "@/lib/gameSession";
import { CURRENT_USER_ID } from "@/lib/mockData";
import { PromptSlab } from "@/components/PromptSlab";
import { VoteGrid } from "@/components/VoteGrid";
import { TallyBars } from "@/components/TallyBars";
import { RankRow } from "@/components/RankRow";
import { RubberStamp } from "@/components/RubberStamp";

function CountdownPill({ endsAt }: { endsAt: number }) {
  const [remaining, setRemaining] = useState(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
  useEffect(() => {
    const t = setInterval(() => {
      setRemaining(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
    }, 200);
    return () => clearInterval(t);
  }, [endsAt]);
  const danger = remaining <= 5;
  return (
    <View
      style={{
        backgroundColor: danger ? colors.pink : colors.ink,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Text
        style={{
          color: danger ? colors.ink : colors.lime,
          fontFamily: "Courier",
          fontWeight: "900",
          fontSize: 18,
          fontVariant: ["tabular-nums"],
          letterSpacing: 1,
        }}
      >
        {String(remaining).padStart(2, "0")}s
      </Text>
    </View>
  );
}

function LockOverlay() {
  const v = useState(new Animated.Value(0))[0];
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [v]);
  const scale = v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View style={{ transform: [{ scale }, { rotate: "-8deg" }] }}>
        <View
          style={{
            backgroundColor: colors.ink,
            paddingHorizontal: 30,
            paddingVertical: 16,
            borderColor: colors.pink,
            borderWidth: border.brutal,
          }}
        >
          <Text
            style={{
              color: colors.pink,
              fontFamily: "Courier",
              fontWeight: "900",
              fontSize: 28,
              letterSpacing: 4,
            }}
          >
            LOCKED
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

export default function PlayScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const { session, advancePhase, castVote, resetSession } = useGameSession();

  useEffect(() => {
    if (!session || session.id !== sessionId) {
      router.replace("/");
    }
  }, [session, sessionId, router]);

  useEffect(() => {
    if (!session) return;
    if (session.phase === "LOBBY") {
      router.replace(`/game/${session.id}/lobby`);
    } else if (session.phase === "FINAL") {
      router.replace(`/game/${session.id}/final`);
    }
  }, [session, router]);

  const currentRound = useMemo(() => {
    if (!session) return null;
    return session.rounds[session.currentRoundIndex];
  }, [session]);

  if (!session || !currentRound) return null;

  const viewerVote = currentRound.votes[CURRENT_USER_ID] ?? null;
  const lockedVoters = useMemo(
    () => new Set(Object.keys(currentRound.votes)),
    [currentRound.votes]
  );
  const ranked = useMemo(
    () => session.players.slice().sort((a, b) => b.score - a.score),
    [session.players]
  );

  const myAward = currentRound.result?.awards.find((a) => a.voterId === CURRENT_USER_ID);
  const myDelta = currentRound.pointsAwarded?.[CURRENT_USER_ID] ?? 0;

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bone }}>
      {/* Header strip */}
      <View
        style={{
          backgroundColor: colors.ink,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 12,
          borderBottomColor: colors.lime,
          borderBottomWidth: border.brutal,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              color: colors.lime,
              fontFamily: "Courier",
              fontSize: 10,
              fontWeight: "900",
              letterSpacing: 1.6,
            }}
          >
            PARTY MODE
          </Text>
          <Text
            style={{
              color: colors.chalk,
              fontWeight: "900",
              fontSize: 18,
              letterSpacing: -0.4,
              marginTop: 2,
            }}
          >
            ROUND {currentRound.number} / {session.rounds.length}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {session.phase === "VOTING" && session.votingEndsAt ? (
            <CountdownPill endsAt={session.votingEndsAt} />
          ) : (
            <View
              style={{
                backgroundColor: colors.lime,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  color: colors.ink,
                  fontFamily: "Courier",
                  fontWeight: "900",
                  fontSize: 12,
                  letterSpacing: 1.4,
                }}
              >
                {session.phase}
              </Text>
            </View>
          )}
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
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
        {/* Prompt — always visible */}
        <PromptSlab
          prompt={currentRound.challenge.prompt}
          roundNumber={currentRound.number}
          totalRounds={session.rounds.length}
        />

        {/* Phase-specific body */}
        {session.phase === "PROMPT" ? (
          <View style={{ alignItems: "center", padding: 18 }}>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: "Courier",
                fontWeight: "900",
                fontSize: 13,
                letterSpacing: 2,
              }}
            >
              GET READY...
            </Text>
          </View>
        ) : null}

        {session.phase === "VOTING" || session.phase === "LOCK" ? (
          <View style={{ position: "relative", padding: 8 }}>
            <VoteGrid
              players={session.players}
              viewerId={CURRENT_USER_ID}
              myPick={viewerVote}
              lockedVoters={lockedVoters}
              onPick={(id) => castVote(id)}
              disabled={session.phase === "LOCK"}
            />
            {viewerVote ? (
              <View style={{ marginTop: 10, marginRight: 5 }}>
                <Pressable
                  onPress={() => advancePhase()}
                  style={{
                    backgroundColor: colors.ink,
                    paddingVertical: 10,
                    alignItems: "center",
                    borderColor: colors.lime,
                    borderWidth: border.thick,
                  }}
                >
                  <Text
                    style={{
                      color: colors.lime,
                      fontFamily: "Courier",
                      fontWeight: "900",
                      fontSize: 12,
                      letterSpacing: 1.4,
                    }}
                  >
                    LOCK EARLY (FORCE REVEAL)
                  </Text>
                </Pressable>
              </View>
            ) : null}
            {session.phase === "LOCK" ? <LockOverlay /> : null}
          </View>
        ) : null}

        {session.phase === "REVEAL" && currentRound.result ? (
          <View style={{ padding: 8 }}>
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
              ━ THE VERDICT ━━━━━━━━━
            </Text>
            <TallyBars
              players={session.players}
              tally={currentRound.result.tally}
              pluralityTargetIds={currentRound.result.pluralityTargetIds}
            />
            <View
              style={{
                marginTop: 16,
                backgroundColor: colors.ink,
                padding: 14,
                marginRight: 5,
              }}
            >
              <Text
                style={{
                  color: colors.lime,
                  fontFamily: "Courier",
                  fontSize: 11,
                  fontWeight: "900",
                  letterSpacing: 1.4,
                  marginBottom: 4,
                }}
              >
                YOUR PICK
              </Text>
              {myAward ? (
                <>
                  <Text
                    style={{
                      color: colors.chalk,
                      fontSize: 17,
                      fontWeight: "900",
                      letterSpacing: -0.2,
                      textTransform: "uppercase",
                    }}
                  >
                    {viewerVote
                      ? session.players.find((p) => p.userId === viewerVote)?.handle
                      : "NO PICK"}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, gap: 12 }}>
                    <RubberStamp stamp={myAward.stamp} />
                    <Text
                      style={{
                        color: myDelta > 0 ? colors.lime : colors.pink,
                        fontFamily: "Courier",
                        fontSize: 22,
                        fontWeight: "900",
                        fontVariant: ["tabular-nums"],
                      }}
                    >
                      {myDelta > 0 ? "+" : ""}
                      {myDelta}
                    </Text>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        ) : null}

        {session.phase === "SCOREBOARD" ? (
          <View style={{ padding: 8 }}>
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
              ━ STANDINGS ━━━━━━━━━━
            </Text>
            {ranked.map((p, i) => (
              <RankRow
                key={p.userId}
                rank={i + 1}
                player={p}
                delta={currentRound.pointsAwarded?.[p.userId] ?? 0}
                highlight={p.userId === CURRENT_USER_ID}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
