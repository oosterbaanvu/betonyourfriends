import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
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
  LIVE: { label: "LIVE", bg: colors.liveBg, fg: colors.chalk },
  OPEN: { label: "OPEN", bg: colors.lime, fg: colors.ink },
  RESOLVING: { label: "VERDICT", bg: colors.warnBg, fg: colors.ink },
  CLOSED: { label: "CLOSED", bg: colors.ash, fg: colors.chalk },
};

type Tab = "open" | "verdict" | "resolved";

function HiddenCount({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <View
      style={{
        backgroundColor: colors.ink,
        padding: 14,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 5,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderColor: colors.lime,
          borderWidth: border.thick,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="eye-off" size={18} color={colors.lime} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "900",
            color: colors.chalk,
            fontSize: 13,
            letterSpacing: 0.6,
          }}
        >
          {count} PROP{count > 1 ? "S" : ""} HIDDEN
        </Text>
        <Text
          style={{
            color: "#A1A1A1",
            fontSize: 11,
            fontWeight: "700",
            marginTop: 2,
            fontFamily: "Courier",
          }}
        >
          Some props are about you. Verdicts only.
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
    { id: "open", label: "OPEN" },
    { id: "verdict", label: "VERDICT" },
    { id: "resolved", label: "RESOLVED" },
  ];
  return (
    <View
      style={{
        flexDirection: "row",
        borderColor: colors.ink,
        borderWidth: border.thick,
        marginBottom: 16,
      }}
    >
      {items.map((it, i) => {
        const isActive = tab === it.id;
        return (
          <Pressable
            key={it.id}
            onPress={() => onChange(it.id)}
            style={{
              flex: 1,
              backgroundColor: isActive ? colors.ink : colors.chalk,
              paddingVertical: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              borderRightWidth:
                i === items.length - 1 ? 0 : border.thick,
              borderRightColor: colors.ink,
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
              {it.label}
            </Text>
            {counts[it.id] > 0 ? (
              <Text
                style={{
                  marginLeft: 6,
                  color: isActive ? colors.lime : colors.textMuted,
                  fontSize: 11,
                  fontWeight: "900",
                  fontVariant: ["tabular-nums"],
                  fontFamily: "Courier",
                }}
              >
                {counts[it.id]}
              </Text>
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
  bg = "chalk",
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  bg?: keyof typeof colors;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors[bg],
        borderColor: colors.ink,
        borderWidth: border.thick,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginLeft: 6,
      }}
    >
      <Ionicons name={icon} size={14} color={colors.ink} />
      <Text
        style={{
          marginLeft: 5,
          color: colors.ink,
          fontSize: 11,
          fontWeight: "900",
          letterSpacing: 1.2,
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
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

  const tabProps =
    tab === "open" ? open : tab === "verdict" ? awaiting : resolved;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.bone }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Title slab */}
      <View
        style={{
          paddingHorizontal: 18,
          paddingTop: 12,
          paddingBottom: 16,
          backgroundColor: colors.chalk,
          borderBottomColor: colors.ink,
          borderBottomWidth: border.brutal,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
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
              backgroundColor: colors.ink,
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
              MARKETS
            </Text>
          </Pressable>
          <View
            style={{
              backgroundColor: colors.ink,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                color: colors.lime,
                fontSize: 9,
                fontWeight: "900",
                letterSpacing: 1.2,
              }}
            >
              BAL
            </Text>
            <Text
              style={{
                color: colors.chalk,
                fontSize: 14,
                fontWeight: "900",
                fontVariant: ["tabular-nums"],
              }}
            >
              {balance.toLocaleString()}
            </Text>
          </View>
        </View>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
        >
          <View
            style={{
              backgroundColor: meta.bg,
              borderColor: colors.ink,
              borderWidth: border.thick,
              paddingHorizontal: 8,
              paddingVertical: 3,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: meta.fg,
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 1.4,
              }}
            >
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
            fontSize: 28,
            fontWeight: "900",
            color: colors.ink,
            letterSpacing: -0.8,
            lineHeight: 32,
            textTransform: "uppercase",
          }}
        >
          {event.title}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: "900",
            marginTop: 4,
            fontFamily: "Courier",
            letterSpacing: 1,
          }}
        >
          BY {event.creator.toUpperCase()} · {visible.length} MARKETS · VOL{" "}
          {totalVolume.toLocaleString()}
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
              fontSize: 11,
              fontWeight: "900",
              letterSpacing: 1,
              fontFamily: "Courier",
            }}
          >
            {members.length} IN
          </Text>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
            <HeaderAction
              icon="add"
              label="ADD PROP"
              onPress={() => setShowAdd(true)}
              bg="lime"
            />
            <HeaderAction
              icon="share-social"
              label="INVITE"
              onPress={() => setShowInvite(true)}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bone }}
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
              backgroundColor: colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.brutal,
              padding: 24,
              alignItems: "center",
              marginRight: 5,
            }}
          >
            <Ionicons
              name={
                tab === "open"
                  ? "list"
                  : tab === "verdict"
                  ? "hourglass"
                  : "checkmark-done"
              }
              size={26}
              color={colors.ink}
            />
            <Text
              style={{
                marginTop: 8,
                color: colors.ink,
                fontSize: 14,
                fontWeight: "900",
                letterSpacing: -0.2,
                textTransform: "uppercase",
              }}
            >
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
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 4,
                  fontWeight: "700",
                  fontFamily: "Courier",
                }}
              >
                TAP "ADD PROP" TO PUT UP THE FIRST MARKET.
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
