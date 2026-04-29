import { View, Text, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { ScreenFrame } from "@/components/ScreenFrame";
import { BrutalCard } from "@/components/BrutalCard";
import { colors, radius } from "@/theme/tokens";
import { mockEvents, MockEvent } from "@/lib/mockData";

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
      <Text style={{ color: m.fg, fontSize: 12, fontWeight: "600" }}>
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

function EventRow({ event }: { event: MockEvent }) {
  return (
    <Pressable>
      <BrutalCard>
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
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ color: colors.textFaint, fontSize: 11, fontWeight: "600" }}>
              MARKETS
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "700",
                marginTop: 2,
                fontVariant: ["tabular-nums"],
              }}
            >
              {event.propsCount}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: colors.textFaint, fontSize: 11, fontWeight: "600" }}>
              VOLUME
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: "700",
                marginTop: 2,
                fontVariant: ["tabular-nums"],
              }}
            >
              {event.potTokens.toLocaleString()} ⚡
            </Text>
          </View>
        </View>
      </BrutalCard>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [category, setCategory] = useState<string>("All");

  const filtered =
    category === "Live"
      ? mockEvents.filter((e) => e.status === "LIVE" || e.status === "RESOLVING")
      : mockEvents;

  return (
    <ScreenFrame
      title="Markets"
      trailing={
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "500" }}>
          ⚡ 2,840
        </Text>
      }
    >
      <View
        style={{
          margin: -16,
          marginBottom: 12,
        }}
      >
        <CategoryChips active={category} onChange={setCategory} />
      </View>

      {filtered.map((e) => (
        <EventRow key={e.id} event={e} />
      ))}
    </ScreenFrame>
  );
}
