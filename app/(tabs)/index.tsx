import { View, Text, Pressable, ScrollView } from "react-native";
import { useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenFrame } from "@/components/ScreenFrame";
import { AvatarStack } from "@/components/AvatarStack";
import { colors, radius } from "@/theme/tokens";
import {
  mockEvents,
  MockEvent,
  visiblePropsFor,
  mockFriends,
} from "@/lib/mockData";
import { useStore } from "@/lib/store";

const STATUS_META: Record<
  MockEvent["status"],
  { label: string; bg: string; fg: string; dot?: boolean }
> = {
  LIVE: { label: "Live", bg: colors.liveFaint, fg: colors.live, dot: true },
  OPEN: { label: "Open", bg: colors.primaryFaint, fg: colors.primary },
  RESOLVING: { label: "Resolving", bg: colors.warnFaint, fg: colors.warn },
  CLOSED: { label: "Closed", bg: colors.neutralFaint, fg: colors.neutral },
};

function StatusPill({ status }: { status: MockEvent["status"] }) {
  const m = STATUS_META[status];
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: m.bg,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: radius.pill,
        alignSelf: "flex-start",
      }}
    >
      {m.dot ? (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: m.fg,
            marginRight: 5,
          }}
        />
      ) : null}
      <Text style={{ color: m.fg, fontSize: 12, fontWeight: "700" }}>
        {m.label}
      </Text>
    </View>
  );
}

const CATEGORIES = ["All", "Live", "Tonight", "This Week"] as const;

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
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      style={{
        backgroundColor: colors.bg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingVertical: 10,
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
              borderRadius: radius.pill,
              backgroundColor: isActive ? colors.text : colors.bgInset,
            }}
          >
            <Text
              style={{
                color: isActive ? "#FFFFFF" : colors.text,
                fontWeight: "600",
                fontSize: 13,
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
      <View
        style={{
          backgroundColor: colors.text,
          borderRadius: radius.lg,
          padding: 18,
          marginBottom: 16,
          overflow: "hidden",
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
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: radius.pill,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.live,
                marginRight: 6,
              }}
            />
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>
              LIVE NOW
            </Text>
          </View>
          <Text
            style={{
              marginLeft: "auto",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {event.startsAt}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: "#FFFFFF",
            letterSpacing: -0.6,
            lineHeight: 30,
          }}
        >
          {event.title}
        </Text>

        <Text
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: 13,
            fontWeight: "500",
            marginTop: 4,
          }}
        >
          by {event.creator}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            marginTop: 18,
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 1.2,
              }}
            >
              MARKETS
            </Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: "800",
                fontVariant: ["tabular-nums"],
                marginTop: 2,
              }}
            >
              {visibleCount}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.5)",
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 1.2,
              }}
            >
              VOLUME
            </Text>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontWeight: "800",
                fontVariant: ["tabular-nums"],
                marginTop: 2,
              }}
            >
              {volume.toLocaleString()}
            </Text>
          </View>
          <AvatarStack friends={members} size={28} />
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
      <View
        style={{
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: radius.lg,
          padding: 16,
          marginBottom: 12,
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
          <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: "500" }}>
            {event.startsAt}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: colors.text,
            letterSpacing: -0.2,
            lineHeight: 22,
          }}
        >
          {event.title}
        </Text>

        <Text
          style={{
            marginTop: 2,
            color: colors.textMuted,
            fontSize: 13,
            fontWeight: "500",
          }}
        >
          by {event.creator}
        </Text>

        <View
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textFaint, fontSize: 10, fontWeight: "700", letterSpacing: 1 }}>
              MARKETS
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 17,
                fontWeight: "800",
                marginTop: 2,
                fontVariant: ["tabular-nums"],
              }}
            >
              {visibleCount}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.textFaint, fontSize: 10, fontWeight: "700", letterSpacing: 1 }}>
              VOLUME
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 17,
                fontWeight: "800",
                marginTop: 2,
                fontVariant: ["tabular-nums"],
              }}
            >
              {volume.toLocaleString()}
            </Text>
          </View>
          <AvatarStack friends={members} size={26} />
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [category, setCategory] = useState<string>("All");
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
    if (category === "Live") {
      return eventStats.filter(
        ({ event }) => event.status === "LIVE" || event.status === "RESOLVING"
      );
    }
    if (category === "Tonight") {
      return eventStats.filter(
        ({ event }) =>
          event.startsInMinutes >= -240 && event.startsInMinutes <= 60 * 6
      );
    }
    if (category === "This Week") {
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
      trailing={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.bgInset,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: radius.pill,
          }}
        >
          <Ionicons name="wallet-outline" size={13} color={colors.text} />
          <Text
            style={{
              marginLeft: 5,
              color: colors.text,
              fontSize: 13,
              fontWeight: "700",
              fontVariant: ["tabular-nums"],
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
            fontWeight: "700",
            color: colors.textMuted,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          All events
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
