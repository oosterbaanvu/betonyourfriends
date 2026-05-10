import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenFrame } from "@/components/ScreenFrame";
import { BrutalButton } from "@/components/BrutalButton";
import { colors, border } from "@/theme/tokens";
import { CHALLENGE_PACKS } from "@/lib/challengePacks";
import { mockEvents } from "@/lib/mockData";
import { useGameSession } from "@/lib/gameSession";

export default function PartyLaunchScreen() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const router = useRouter();
  const { createSession } = useGameSession();
  const fallbackEvent = mockEvents[0];
  const event =
    mockEvents.find((e) => e.id === eventId) ?? fallbackEvent;

  // Pick default pack based on event vibe if possible.
  const defaultPackId = useMemo(() => {
    if (!event) return CHALLENGE_PACKS[0].id;
    if (event.id === "evt_2") return "cp_darts";
    if (event.id === "evt_1") return "cp_birthday";
    if (event.id === "evt_3") return "cp_sports";
    if (event.id === "evt_5") return "cp_bar";
    return CHALLENGE_PACKS[0].id;
  }, [event]);

  const [selected, setSelected] = useState<string>(defaultPackId);
  const [rounds, setRounds] = useState<number>(8);

  const onStart = () => {
    const sid = createSession(event.id, selected, {
      rounds,
      memberIds: event.memberIds,
    });
    router.replace(`/game/${sid}/lobby`);
  };

  return (
    <ScreenFrame
      title="Party Mode"
      accent="lime"
      leading={
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: colors.ink,
            alignSelf: "flex-start",
          }}
        >
          <Ionicons name="chevron-back" size={14} color={colors.chalk} />
          <Text
            style={{
              marginLeft: 4,
              color: colors.chalk,
              fontSize: 11,
              fontWeight: "900",
              letterSpacing: 1.4,
            }}
          >
            BACK
          </Text>
        </Pressable>
      }
    >
      <View
        style={{
          backgroundColor: colors.ink,
          padding: 16,
          marginBottom: 16,
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
          }}
        >
          EVENT
        </Text>
        <Text
          style={{
            color: colors.chalk,
            fontSize: 22,
            fontWeight: "900",
            letterSpacing: -0.4,
            textTransform: "uppercase",
            marginTop: 2,
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
            letterSpacing: 1,
            marginTop: 6,
          }}
        >
          WHO'S MOST LIKELY · {event.memberIds.length} PLAYERS · LIVE
        </Text>
      </View>

      <Text
        style={{
          fontSize: 11,
          fontWeight: "900",
          color: colors.textMuted,
          letterSpacing: 1.6,
          fontFamily: "Courier",
          marginBottom: 8,
        }}
      >
        ━ PICK A CHALLENGE PACK ━━━━━━━
      </Text>

      <ScrollView style={{ marginBottom: 18 }} showsVerticalScrollIndicator={false}>
        {CHALLENGE_PACKS.map((pack) => {
          const isActive = selected === pack.id;
          return (
            <Pressable key={pack.id} onPress={() => setSelected(pack.id)}>
              <View
                style={{
                  position: "relative",
                  marginRight: 5,
                  marginBottom: 12,
                }}
              >
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
                    backgroundColor: isActive ? colors[pack.accent] : colors.chalk,
                    borderColor: colors.ink,
                    borderWidth: border.brutal,
                    padding: 14,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      backgroundColor: isActive ? colors.ink : colors[pack.accent],
                      borderColor: colors.ink,
                      borderWidth: border.thick,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: isActive ? colors.chalk : colors.ink,
                        fontFamily: "Courier",
                        fontWeight: "900",
                        fontSize: 16,
                        letterSpacing: 1,
                      }}
                    >
                      {pack.monogram}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.ink,
                        fontWeight: "900",
                        fontSize: 16,
                        letterSpacing: -0.2,
                        textTransform: "uppercase",
                      }}
                    >
                      {pack.label}
                    </Text>
                    <Text
                      style={{
                        color: colors.ink,
                        fontFamily: "Courier",
                        fontSize: 11,
                        fontWeight: "700",
                        marginTop: 2,
                      }}
                    >
                      {pack.tagline}
                    </Text>
                    <Text
                      style={{
                        color: colors.ink,
                        fontFamily: "Courier",
                        fontSize: 10,
                        fontWeight: "900",
                        marginTop: 4,
                        opacity: 0.7,
                        letterSpacing: 1,
                      }}
                    >
                      {pack.prompts.length} PROMPTS{pack.adult ? "  ·  18+" : ""}
                    </Text>
                  </View>
                  {isActive ? (
                    <Ionicons name="checkmark" size={22} color={colors.ink} />
                  ) : null}
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View
        style={{
          backgroundColor: colors.chalk,
          borderColor: colors.ink,
          borderWidth: border.thick,
          padding: 14,
          marginBottom: 14,
          marginRight: 5,
        }}
      >
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Courier",
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.4,
          }}
        >
          ROUNDS
        </Text>
        <View style={{ flexDirection: "row", marginTop: 8, gap: 8 }}>
          {[5, 8, 12].map((n) => {
            const isActive = rounds === n;
            return (
              <Pressable
                key={n}
                onPress={() => setRounds(n)}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  backgroundColor: isActive ? colors.ink : colors.chalk,
                  borderColor: colors.ink,
                  borderWidth: border.thick,
                }}
              >
                <Text
                  style={{
                    color: isActive ? colors.chalk : colors.ink,
                    fontWeight: "900",
                    fontSize: 14,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {n}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <BrutalButton label="LAUNCH PARTY" fullWidth size="lg" variant="yes" onPress={onStart} />
    </ScreenFrame>
  );
}
