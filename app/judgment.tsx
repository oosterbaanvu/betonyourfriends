import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import { mirrorStateFor, MockProp, mockFriends } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { Stamp } from "@/components/Stamp";

const PALETTE = ["#2563EB", "#DB2777", "#059669", "#EA580C", "#7C3AED", "#0891B2", "#CA8A04"];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}
function handleOf(userId: string): string {
  return mockFriends.find((f) => f.id === userId)?.handle ?? userId;
}

function StampCard({ prop }: { prop: MockProp }) {
  const verdict = prop.subjectVerdict;
  if (!verdict) return null;
  const stamp = verdict === "CONFESSED" ? "GUILTY" : "SQUEAKY CLEAN";
  return (
    <View style={{ position: "relative", marginRight: 6, marginBottom: 14 }}>
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
          backgroundColor: colors.paper,
          borderColor: colors.ink,
          borderWidth: border.brutal,
          padding: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, paddingRight: 14 }}>
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 10,
              fontWeight: "900",
              letterSpacing: 1.4,
              fontFamily: "Courier",
              marginBottom: 4,
            }}
          >
            CASE CLOSED
          </Text>
          <Text
            style={{
              color: colors.ink,
              fontSize: 16,
              fontWeight: "800",
              letterSpacing: -0.2,
              lineHeight: 22,
            }}
          >
            {prop.description}
          </Text>
        </View>
        <Stamp verdict={stamp} size="md" />
      </View>
    </View>
  );
}

function CaseFile({ prop }: { prop: MockProp }) {
  const { confessOrDeny } = useStore();
  const [busy, setBusy] = useState<null | "CONFESSED" | "DENIED">(null);
  const animScale = useState(() => new Animated.Value(1))[0];

  const decide = (verdict: "CONFESSED" | "DENIED") => {
    setBusy(verdict);
    Animated.sequence([
      Animated.timing(animScale, {
        toValue: 0.96,
        duration: 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(animScale, {
        toValue: 1,
        duration: 80,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      confessOrDeny(prop.id, verdict);
      setBusy(null);
    }, 220);
  };

  return (
    <Animated.View
      style={{
        position: "relative",
        marginRight: 6,
        marginBottom: 18,
        transform: [{ scale: animScale }],
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
          backgroundColor: colors.chalk,
          borderColor: colors.ink,
          borderWidth: border.brutal,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <View
            style={{
              backgroundColor: colors.blood,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderColor: colors.ink,
              borderWidth: border.thick,
            }}
          >
            <Text
              style={{
                color: colors.chalk,
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 1.4,
              }}
            >
              TIMER ENDED
            </Text>
          </View>
          <Text
            style={{
              marginLeft: 10,
              color: colors.textMuted,
              fontSize: 11,
              fontWeight: "700",
              fontFamily: "Courier",
            }}
          >
            CASE #{prop.id.replace(/^prp_/, "").padStart(4, "0")}
          </Text>
        </View>

        <Text
          style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.4,
            marginBottom: 6,
          }}
        >
          YOUR FRIENDS BET THAT YOU WOULD:
        </Text>
        <Text
          style={{
            color: colors.ink,
            fontSize: 22,
            fontWeight: "900",
            letterSpacing: -0.5,
            lineHeight: 28,
          }}
        >
          {prop.description}
        </Text>

        <View
          style={{
            height: border.thick,
            backgroundColor: colors.ink,
            marginVertical: 18,
          }}
        />

        <Text
          style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.4,
            marginBottom: 10,
          }}
        >
          THE TRUTH NOW
        </Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => decide("CONFESSED")}
            disabled={busy !== null}
            style={{ flex: 1 }}
          >
            <View
              style={{
                position: "relative",
                marginRight: 4,
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  right: -4,
                  bottom: -4,
                  backgroundColor: colors.ink,
                }}
              />
              <View
                style={{
                  backgroundColor: colors.blood,
                  borderColor: colors.ink,
                  borderWidth: border.brutal,
                  paddingVertical: 18,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.chalk,
                    fontSize: 11,
                    fontWeight: "900",
                    letterSpacing: 1.6,
                  }}
                >
                  I CONFESS
                </Text>
                <Text
                  style={{
                    color: colors.chalk,
                    fontSize: 18,
                    fontWeight: "900",
                    marginTop: 2,
                  }}
                >
                  IT HAPPENED
                </Text>
              </View>
            </View>
          </Pressable>
          <Pressable
            onPress={() => decide("DENIED")}
            disabled={busy !== null}
            style={{ flex: 1 }}
          >
            <View
              style={{
                position: "relative",
                marginRight: 4,
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  right: -4,
                  bottom: -4,
                  backgroundColor: colors.ink,
                }}
              />
              <View
                style={{
                  backgroundColor: colors.lime,
                  borderColor: colors.ink,
                  borderWidth: border.brutal,
                  paddingVertical: 18,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.ink,
                    fontSize: 11,
                    fontWeight: "900",
                    letterSpacing: 1.6,
                  }}
                >
                  I DENY
                </Text>
                <Text
                  style={{
                    color: colors.ink,
                    fontSize: 18,
                    fontWeight: "900",
                    marginTop: 2,
                  }}
                >
                  DIDN'T HAPPEN
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        <Text
          style={{
            marginTop: 14,
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: "700",
            fontFamily: "Courier",
          }}
        >
          YOUR VERDICT RESOLVES THIS PROP. CHOOSE WISELY.
        </Text>
      </View>
    </Animated.View>
  );
}

/**
 * Reveal card for a WMLT prop where the viewer was the plurality winner.
 * Shows who voted for them, voter-by-voter.
 */
function WmltRevealCard({ prop, viewerId }: { prop: MockProp; viewerId: string }) {
  const voters = Object.entries(prop.wmltVotes ?? {})
    .filter(([, target]) => target === viewerId)
    .map(([voter]) => voter);
  const otherVotes = Object.entries(prop.wmltVotes ?? {}).filter(([, target]) => target !== viewerId);

  return (
    <View style={{ position: "relative", marginRight: 6, marginBottom: 16 }}>
      <View
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          right: -6,
          bottom: -6,
          backgroundColor: colors.lime,
        }}
      />
      <View
        style={{
          backgroundColor: colors.ink,
          borderColor: colors.ink,
          borderWidth: border.brutal,
          padding: 18,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              backgroundColor: colors.lime,
              paddingHorizontal: 8,
              paddingVertical: 3,
              marginRight: 8,
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
              ASKUS · YOU WON
            </Text>
          </View>
          <Text
            style={{
              color: "#A1A1A1",
              fontFamily: "Courier",
              fontSize: 11,
              fontWeight: "700",
            }}
          >
            {voters.length} VOTE{voters.length === 1 ? "" : "S"} FOR YOU
          </Text>
        </View>

        <Text
          style={{
            color: colors.chalk,
            fontSize: 19,
            fontWeight: "900",
            letterSpacing: -0.4,
            lineHeight: 24,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {prop.description}
        </Text>

        <Text
          style={{
            color: colors.lime,
            fontFamily: "Courier",
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.4,
            marginBottom: 8,
          }}
        >
          ━ THEY PICKED YOU ━━━━━━━
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {voters.length === 0 ? (
            <Text style={{ color: "#A1A1A1", fontFamily: "Courier", fontSize: 12 }}>
              (no votes — you won on a tie)
            </Text>
          ) : (
            voters.map((vid) => (
              <View
                key={vid}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.lime,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: colorFor(vid),
                    marginRight: 6,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#FFF", fontWeight: "900", fontSize: 11 }}>
                    {handleOf(vid).replace(/^@/, "")[0]?.toUpperCase() ?? "?"}
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.ink,
                    fontWeight: "900",
                    fontSize: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {handleOf(vid)}
                </Text>
              </View>
            ))
          )}
        </View>

        {otherVotes.length > 0 ? (
          <>
            <Text
              style={{
                color: "#A1A1A1",
                fontFamily: "Courier",
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 1.2,
                marginBottom: 6,
              }}
            >
              EVERYONE ELSE
            </Text>
            <View style={{ gap: 4 }}>
              {otherVotes.map(([voter, target]) => (
                <View
                  key={voter}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Text
                    style={{
                      color: colors.chalk,
                      fontFamily: "Courier",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {handleOf(voter)}
                  </Text>
                  <Text
                    style={{
                      color: "#A1A1A1",
                      fontFamily: "Courier",
                      fontSize: 12,
                      fontWeight: "700",
                      marginHorizontal: 6,
                    }}
                  >
                    →
                  </Text>
                  <Text
                    style={{
                      color: colors.lime,
                      fontFamily: "Courier",
                      fontSize: 12,
                      fontWeight: "900",
                    }}
                  >
                    {handleOf(target)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}

export default function JudgmentScreen() {
  const router = useRouter();
  const { props, viewerId } = useStore();
  const mirror = useMemo(() => mirrorStateFor(viewerId, props), [viewerId, props]);

  const hasContent =
    mirror.pending.length > 0 ||
    mirror.wmltReveals.length > 0 ||
    mirror.judged.length > 0;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.ink }}
    >
      <StatusBar barStyle="light-content" />

      <View
        style={{
          paddingHorizontal: 18,
          paddingTop: 12,
          paddingBottom: 14,
          backgroundColor: colors.ink,
          borderBottomColor: colors.lime,
          borderBottomWidth: border.brutal,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderColor: colors.chalk,
              borderWidth: border.thick,
            }}
          >
            <Ionicons name="chevron-back" size={14} color={colors.chalk} />
            <Text
              style={{
                marginLeft: 4,
                color: colors.chalk,
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.2,
              }}
            >
              EXIT
            </Text>
          </Pressable>
          <Text
            style={{
              marginLeft: 12,
              color: colors.lime,
              fontSize: 11,
              fontWeight: "900",
              letterSpacing: 1.6,
              fontFamily: "Courier",
            }}
          >
            [ THE MIRROR ]
          </Text>
        </View>
        <Text
          style={{
            color: colors.chalk,
            fontSize: 32,
            fontWeight: "900",
            letterSpacing: -1,
            textTransform: "uppercase",
          }}
        >
          Judgment
        </Text>
        <Text
          style={{
            marginTop: 4,
            color: "#A1A1A1",
            fontSize: 13,
            fontWeight: "700",
          }}
        >
          Timers ended. Time to set the record straight.
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bone }}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      >
        {!hasContent ? (
          <View
            style={{
              backgroundColor: colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.brutal,
              padding: 22,
              alignItems: "center",
              marginRight: 6,
              marginBottom: 6,
            }}
          >
            <Ionicons name="checkmark-done" size={36} color={colors.ink} />
            <Text
              style={{
                marginTop: 10,
                color: colors.ink,
                fontSize: 18,
                fontWeight: "900",
                letterSpacing: -0.3,
              }}
            >
              NOTHING TO REVEAL
            </Text>
            <Text
              style={{
                marginTop: 4,
                color: colors.textMuted,
                fontSize: 13,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Once a bet about you times out, it shows up here.
            </Text>
          </View>
        ) : null}

        {mirror.pending.length > 0 ? (
          <>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.6,
                fontFamily: "Courier",
                marginBottom: 10,
              }}
            >
              {mirror.pending.length} CASE{mirror.pending.length === 1 ? "" : "S"} OPEN
            </Text>
            {mirror.pending.map((p) => (
              <CaseFile key={p.id} prop={p} />
            ))}
          </>
        ) : null}

        {mirror.wmltReveals.length > 0 ? (
          <>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.6,
                fontFamily: "Courier",
                marginBottom: 10,
                marginTop: mirror.pending.length > 0 ? 18 : 0,
              }}
            >
              ASKUS · THEY PICKED YOU
            </Text>
            {mirror.wmltReveals.map((p) => (
              <WmltRevealCard key={p.id} prop={p} viewerId={viewerId} />
            ))}
          </>
        ) : null}

        {mirror.judged.length > 0 ? (
          <>
            <Text
              style={{
                marginTop: 18,
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.6,
                fontFamily: "Courier",
                marginBottom: 10,
              }}
            >
              WALL OF SHAME
            </Text>
            {mirror.judged.map((p) => (
              <StampCard key={p.id} prop={p} />
            ))}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
