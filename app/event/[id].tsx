import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radius } from "@/theme/tokens";
import { mockEvents, MockProp, visiblePropsFor } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { Countdown } from "@/components/Countdown";
import { PropCard } from "@/components/PropCard";
import { WagerSheet } from "@/components/WagerSheet";

const STATUS_META = {
  LIVE: { label: "Live", bg: colors.liveFaint, fg: colors.live, dot: true },
  OPEN: { label: "Open", bg: colors.primaryFaint, fg: colors.primary, dot: false },
  RESOLVING: { label: "Resolving", bg: colors.warnFaint, fg: colors.warn, dot: false },
  CLOSED: { label: "Closed", bg: colors.neutralFaint, fg: colors.neutral, dot: false },
};

function HiddenCount({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View
      style={{
        backgroundColor: colors.neutralFaint,
        borderRadius: radius.lg,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 18, marginRight: 10 }}>🙈</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "700", color: colors.text, fontSize: 14 }}>
          {count} prop{count > 1 ? "s" : ""} hidden
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
          Some props are about you. You'll see the verdict after they resolve.
        </Text>
      </View>
    </View>
  );
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { props, viewerId, balance } = useStore();

  const event = useMemo(() => mockEvents.find((e) => e.id === id), [id]);

  const allPropsForEvent = useMemo(
    () => props.filter((p) => p.eventId === id),
    [props, id]
  );

  const visible = useMemo(
    () => visiblePropsFor(viewerId, allPropsForEvent),
    [viewerId, allPropsForEvent]
  );
  const hiddenCount = allPropsForEvent.length - visible.length;

  const [wagerProp, setWagerProp] = useState<MockProp | null>(null);
  const [wagerSide, setWagerSide] = useState<"YES" | "NO">("YES");

  const onTapWager = (prop: MockProp, side: "YES" | "NO") => {
    setWagerProp(prop);
    setWagerSide(side);
  };

  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <Text style={{ padding: 20, color: colors.textMuted }}>
          Event not found.
        </Text>
      </SafeAreaView>
    );
  }

  const meta = STATUS_META[event.status];

  const open = visible.filter((p) => p.status === "OPEN");
  const awaiting = visible.filter((p) => p.status === "AWAITING_VERDICT");
  const resolved = visible.filter((p) => p.status === "RESOLVED");

  const totalVolume = visible.reduce(
    (acc, p) => acc + p.yesPool + p.noPool,
    0
  );

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
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
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 15 }}>
              ← Back
            </Text>
          </Pressable>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "600" }}>
            ⚡ {balance.toLocaleString()}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: meta.bg,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: radius.pill,
              marginRight: 8,
            }}
          >
            {meta.dot ? (
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: meta.fg,
                  marginRight: 5,
                }}
              />
            ) : null}
            <Text style={{ color: meta.fg, fontSize: 12, fontWeight: "700" }}>
              {meta.label}
            </Text>
          </View>
          <Countdown
            startsInMinutes={event.startsInMinutes}
            status={event.status}
          />
        </View>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: colors.text,
            letterSpacing: -0.4,
          }}
        >
          {event.title}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 13,
            fontWeight: "500",
            marginTop: 2,
          }}
        >
          by {event.creator}  ·  {visible.length} markets · {totalVolume.toLocaleString()}⚡ volume
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bgSubtle }}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      >
        <HiddenCount count={hiddenCount} />

        {open.length > 0 ? (
          <>
            <SectionLabel>Open markets</SectionLabel>
            {open.map((p) => (
              <PropCard key={p.id} prop={p} onTapWager={onTapWager} />
            ))}
          </>
        ) : null}

        {awaiting.length > 0 ? (
          <>
            <SectionLabel>Awaiting verdict</SectionLabel>
            {awaiting.map((p) => (
              <PropCard key={p.id} prop={p} onTapWager={onTapWager} />
            ))}
          </>
        ) : null}

        {resolved.length > 0 ? (
          <>
            <SectionLabel>Resolved</SectionLabel>
            {resolved.map((p) => (
              <PropCard key={p.id} prop={p} onTapWager={onTapWager} />
            ))}
          </>
        ) : null}

        {visible.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.bg,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: radius.lg,
              padding: 24,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>👀</Text>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 16 }}>
              Nothing to see here
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 13,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Either no props yet, or every prop in this event happens to be
              about you. We don't show those.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <WagerSheet
        prop={wagerProp}
        initialSide={wagerSide}
        onClose={() => setWagerProp(null)}
      />
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: "700",
        color: colors.textMuted,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 8,
        marginTop: 4,
      }}
    >
      {children}
    </Text>
  );
}
