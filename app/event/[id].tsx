import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme/tokens";
import {
  mockEvents,
  MockProp,
  visiblePropsFor,
  mockFriends,
} from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { Countdown } from "@/components/Countdown";
import { PropCard } from "@/components/PropCard";
import { WagerSheet } from "@/components/WagerSheet";
import { InviteSheet } from "@/components/InviteSheet";
import { AddPropSheet } from "@/components/AddPropSheet";
import { AvatarStack } from "@/components/AvatarStack";

const STATUS_META = {
  LIVE: { label: "Live", bg: colors.liveFaint, fg: colors.live, dot: true },
  OPEN: { label: "Open", bg: colors.primaryFaint, fg: colors.primary, dot: false },
  RESOLVING: { label: "Resolving", bg: colors.warnFaint, fg: colors.warn, dot: false },
  CLOSED: { label: "Closed", bg: colors.neutralFaint, fg: colors.neutral, dot: false },
};

type Tab = "open" | "verdict" | "resolved";

function HiddenCount({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.lg,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.sm,
          backgroundColor: colors.bgInset,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        <Ionicons name="eye-off-outline" size={18} color={colors.textMuted} />
      </View>
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

function SegmentedTabs({
  tab,
  onChange,
  counts,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  counts: Record<Tab, number>;
}) {
  const items: { id: Tab; label: string }[] = [
    { id: "open", label: "Open" },
    { id: "verdict", label: "Verdict" },
    { id: "resolved", label: "Resolved" },
  ];
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.bgInset,
        borderRadius: radius.md,
        padding: 4,
        marginBottom: 16,
      }}
    >
      {items.map((it) => {
        const isActive = tab === it.id;
        return (
          <Pressable
            key={it.id}
            onPress={() => onChange(it.id)}
            style={{
              flex: 1,
              backgroundColor: isActive ? colors.bg : "transparent",
              borderRadius: radius.sm,
              paddingVertical: 8,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: isActive ? colors.text : colors.textMuted,
                fontWeight: "700",
                fontSize: 13,
              }}
            >
              {it.label}
            </Text>
            {counts[it.id] > 0 ? (
              <View
                style={{
                  marginLeft: 6,
                  backgroundColor: isActive ? colors.text : "transparent",
                  borderWidth: isActive ? 0 : 1,
                  borderColor: colors.borderStrong,
                  paddingHorizontal: 6,
                  borderRadius: radius.pill,
                  minWidth: 20,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: isActive ? "#FFFFFF" : colors.textMuted,
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {counts[it.id]}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function HeaderAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.pill,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginLeft: 8,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Ionicons name={icon} size={14} color={colors.text} />
      <Text
        style={{
          marginLeft: 5,
          color: colors.text,
          fontSize: 13,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { props, viewerId, balance } = useStore();

  const event = useMemo(() => mockEvents.find((e) => e.id === id), [id]);
  const members = useMemo(
    () =>
      event ? mockFriends.filter((f) => event.memberIds.includes(f.id)) : [],
    [event]
  );

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
  const [showInvite, setShowInvite] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab] = useState<Tab>("open");

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

  const tabProps = tab === "open" ? open : tab === "verdict" ? awaiting : resolved;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
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
            marginBottom: 14,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
            <Text
              style={{
                color: colors.text,
                fontWeight: "600",
                fontSize: 15,
                marginLeft: 2,
              }}
            >
              Markets
            </Text>
          </Pressable>
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
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
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
            fontSize: 24,
            fontWeight: "800",
            color: colors.text,
            letterSpacing: -0.5,
            lineHeight: 28,
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
          by {event.creator}, {visible.length} markets, {totalVolume.toLocaleString()} volume
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 14,
          }}
        >
          <AvatarStack friends={members} size={26} />
          <Text
            style={{
              marginLeft: 10,
              color: colors.textMuted,
              fontSize: 12,
              fontWeight: "600",
            }}
          >
            {members.length} in this event
          </Text>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
            <HeaderAction
              icon="add-outline"
              label="Add prop"
              onPress={() => setShowAdd(true)}
            />
            <HeaderAction
              icon="share-outline"
              label="Invite"
              onPress={() => setShowInvite(true)}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bgSubtle }}
        contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
      >
        <HiddenCount count={hiddenCount} />

        <SegmentedTabs
          tab={tab}
          onChange={setTab}
          counts={{
            open: open.length,
            verdict: awaiting.length,
            resolved: resolved.length,
          }}
        />

        {tabProps.length === 0 ? (
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
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.bgInset,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Ionicons
                name={
                  tab === "open"
                    ? "list-outline"
                    : tab === "verdict"
                    ? "hourglass-outline"
                    : "checkmark-circle-outline"
                }
                size={22}
                color={colors.textMuted}
              />
            </View>
            <Text style={{ color: colors.text, fontWeight: "700", fontSize: 15 }}>
              {tab === "open"
                ? hiddenCount > 0 && allPropsForEvent.length === hiddenCount
                  ? "Nothing to see here"
                  : "No open markets yet"
                : tab === "verdict"
                ? "Nothing waiting on a verdict"
                : "No resolved props yet"}
            </Text>
            {tab === "open" ? (
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  textAlign: "center",
                  marginTop: 4,
                }}
              >
                Tap "Add prop" to put up the first market.
              </Text>
            ) : null}
          </View>
        ) : (
          tabProps.map((p) => (
            <PropCard key={p.id} prop={p} onTapWager={onTapWager} />
          ))
        )}
      </ScrollView>

      <WagerSheet
        prop={wagerProp}
        initialSide={wagerSide}
        onClose={() => setWagerProp(null)}
      />
      <InviteSheet
        visible={showInvite}
        onClose={() => setShowInvite(false)}
        eventTitle={event.title}
        inviteCode={event.inviteCode}
      />
      <AddPropSheet
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        eventId={event.id}
        eventMembers={members}
      />
    </SafeAreaView>
  );
}
