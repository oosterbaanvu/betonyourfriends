import { View, Text, Pressable, ScrollView } from "react-native";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenFrame } from "@/components/ScreenFrame";
import { AvatarStack } from "@/components/AvatarStack";
import { colors, border } from "@/theme/tokens";
import {
  mockEvents,
  MockEvent,
  visiblePropsFor,
  mockFriends,
} from "@/lib/mockData";
import { useStore } from "@/lib/store";

const STATUS_META: Record<
  MockEvent["status"],
  { label: string; bg: keyof typeof colors; fg: keyof typeof colors }
> = {
  LIVE: { label: "LIVE", bg: "liveBg", fg: "chalk" },
  OPEN: { label: "OPEN", bg: "lime", fg: "ink" },
  RESOLVING: { label: "VERDICT", bg: "warnBg", fg: "ink" },
  CLOSED: { label: "CLOSED", bg: "ash", fg: "chalk" },
};

function StatusPill({ status }: { status: MockEvent["status"] }) {
  const m = STATUS_META[status];
  return (
    <View
      style={{
        backgroundColor: colors[m.bg],
        borderColor: colors.ink,
        borderWidth: border.thick,
        paddingHorizontal: 8,
        paddingVertical: 3,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: colors[m.fg],
          fontSize: 10,
          fontWeight: "900",
          letterSpacing: 1.4,
        }}
      >
        {m.label}
      </Text>
    </View>
  );
}

const CATEGORIES = ["ALL", "LIVE", "TONIGHT", "WEEK"] as const;

function CategoryChips({
  active,
  onChange,
}: {
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 12,
      }}
      style={{
        backgroundColor: colors.chalk,
        borderBottomColor: colors.ink,
        borderBottomWidth: border.brutal,
      }}
    >
      {CATEGORIES.map((c) => {
        const isActive = c === active;
        return (
          <Pressable
            key={c}
            onPress={() => onChange(c)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              backgroundColor: isActive ? colors.ink : colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.thick,
            }}
          >
            <Text
              style={{
                color: isActive ? colors.chalk : colors.ink,
                fontWeight: "900",
                fontSize: 11,
                letterSpacing: 1.4,
              }}
            >
              {c}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function HeroCard({
  event,
  visibleCount,
  volume,
  members,
  onPress,
}: {
  event: MockEvent;
  visibleCount: number;
  volume: number;
  members: typeof mockFriends;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View style={{ position: "relative", marginRight: 6, marginBottom: 18 }}>
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
            backgroundColor: colors.ink,
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
            <StatusPill status={event.status} />
            <Text
              style={{
                marginLeft: "auto",
                color: "#A1A1A1",
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.2,
                fontFamily: "Courier",
              }}
            >
              {event.startsAt.toUpperCase()}
            </Text>
          </View>

          <Text
            style={{
              color: colors.chalk,
              fontSize: 30,
              fontWeight: "900",
              letterSpacing: -0.8,
              lineHeight: 34,
              textTransform: "uppercase",
            }}
          >
            {event.title}
          </Text>
          <Text
            style={{
              color: "#A1A1A1",
              fontSize: 12,
              fontWeight: "700",
              marginTop: 6,
              fontFamily: "Courier",
            }}
          >
            BY {event.creator.toUpperCase()}
          </Text>

          <View
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTopColor: colors.lime,
              borderTopWidth: border.thick,
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.lime,
                  fontSize: 9,
                  fontWeight: "900",
                  letterSpacing: 1.4,
                }}
              >
                MARKETS
              </Text>
              <Text
                style={{
                  color: colors.chalk,
                  fontSize: 28,
                  fontWeight: "900",
                  fontVariant: ["tabular-nums"],
                  letterSpacing: -1,
                }}
              >
                {visibleCount}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.lime,
                  fontSize: 9,
                  fontWeight: "900",
                  letterSpacing: 1.4,
                }}
              >
                VOLUME
              </Text>
              <Text
                style={{
                  color: colors.chalk,
                  fontSize: 28,
                  fontWeight: "900",
                  fontVariant: ["tabular-nums"],
                  letterSpacing: -1,
                }}
              >
                {volume.toLocaleString()}
              </Text>
            </View>
            <AvatarStack friends={members} size={28} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function EventRow({
  event,
  visibleCount,
  volume,
  members,
  onPress,
}: {
  event: MockEvent;
  visibleCount: number;
  volume: number;
  members: typeof mockFriends;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View style={{ position: "relative", marginRight: 5, marginBottom: 14 }}>
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
            backgroundColor: colors.chalk,
            borderColor: colors.ink,
            borderWidth: border.brutal,
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <StatusPill status={event.status} />
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1,
                fontFamily: "Courier",
              }}
            >
              {event.startsAt.toUpperCase()}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 19,
              fontWeight: "900",
              color: colors.ink,
              letterSpacing: -0.4,
              lineHeight: 23,
              textTransform: "uppercase",
            }}
          >
            {event.title}
          </Text>
          <Text
            style={{
              marginTop: 4,
              color: colors.textMuted,
              fontSize: 11,
              fontWeight: "700",
              fontFamily: "Courier",
            }}
          >
            BY {event.creator.toUpperCase()}
          </Text>

          <View
            style={{
              marginTop: 14,
              paddingTop: 10,
              borderTopColor: colors.ink,
              borderTopWidth: border.thick,
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 9,
                  fontWeight: "900",
                  letterSpacing: 1.2,
                }}
              >
                MARKETS
              </Text>
              <Text
                style={{
                  color: colors.ink,
                  fontSize: 22,
                  fontWeight: "900",
                  fontVariant: ["tabular-nums"],
                  letterSpacing: -0.6,
                }}
              >
                {visibleCount}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 9,
                  fontWeight: "900",
                  letterSpacing: 1.2,
                }}
              >
                VOLUME
              </Text>
              <Text
                style={{
                  color: colors.ink,
                  fontSize: 22,
                  fontWeight: "900",
                  fontVariant: ["tabular-nums"],
                  letterSpacing: -0.6,
                }}
              >
                {volume.toLocaleString()}
              </Text>
            </View>
            <AvatarStack friends={members} size={24} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function MarketsScreen() {
  const [category, setCategory] = useState<string>("ALL");
  const router = useRouter();
  const { props, viewerId, balance } = useStore();

  const eventStats = useMemo(() => {
    return mockEvents.map((e) => {
      const propsForEvent = props.filter((p) => p.eventId === e.id);
      const visible = visiblePropsFor(viewerId, propsForEvent);
      const volume = visible.reduce((acc, p) => acc + p.yesPool + p.noPool, 0);
      const members = mockFriends.filter((f) => e.memberIds.includes(f.id));
      return { event: e, visibleCount: visible.length, volume, members };
    });
  }, [props, viewerId]);

  const filtered = useMemo(() => {
    if (category === "LIVE") {
      return eventStats.filter(
        ({ event }) => event.status === "LIVE" || event.status === "RESOLVING"
      );
    }
    if (category === "TONIGHT") {
      return eventStats.filter(
        ({ event }) =>
          event.startsInMinutes >= -240 && event.startsInMinutes <= 60 * 6
      );
    }
    if (category === "WEEK") {
      return eventStats.filter(
        ({ event }) => event.startsInMinutes <= 60 * 24 * 7
      );
    }
    return eventStats;
  }, [eventStats, category]);

  const hero = filtered.find(({ event }) => event.status === "LIVE");
  const rest = hero ? filtered.filter((s) => s !== hero) : filtered;

  return (
    <ScreenFrame
      title="Markets"
      accent="lime"
      leading={
        <Pressable
          onPress={() => router.push("/")}
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
            HOME
          </Text>
        </Pressable>
      }
      trailing={
        <View
          style={{
            backgroundColor: colors.ink,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              color: colors.lime,
              fontSize: 9,
              fontWeight: "900",
              letterSpacing: 1.4,
            }}
          >
            BALANCE
          </Text>
          <Text
            style={{
              color: colors.chalk,
              fontSize: 18,
              fontWeight: "900",
              fontVariant: ["tabular-nums"],
              letterSpacing: -0.4,
            }}
          >
            {balance.toLocaleString()}
          </Text>
        </View>
      }
    >
      <View style={{ margin: -16, marginBottom: 16 }}>
        <CategoryChips active={category} onChange={setCategory} />
      </View>

      {hero ? (
        <HeroCard
          event={hero.event}
          visibleCount={hero.visibleCount}
          volume={hero.volume}
          members={hero.members}
          onPress={() => router.push(`/event/${hero.event.id}`)}
        />
      ) : null}

      {rest.length > 0 ? (
        <Text
          style={{
            fontSize: 11,
            fontWeight: "900",
            color: colors.textMuted,
            letterSpacing: 1.6,
            fontFamily: "Courier",
            marginBottom: 12,
          }}
        >
          ━ ALL EVENTS ━━━━━━━━━━━
        </Text>
      ) : null}

      {rest.map(({ event, visibleCount, volume, members }) => (
        <EventRow
          key={event.id}
          event={event}
          visibleCount={visibleCount}
          volume={volume}
          members={members}
          onPress={() => router.push(`/event/${event.id}`)}
        />
      ))}
    </ScreenFrame>
  );
}
