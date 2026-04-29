import { View, Text, Pressable } from "react-native";
import { ScreenFrame } from "@/components/ScreenFrame";
import { BrutalCard } from "@/components/BrutalCard";
import { colors, border } from "@/theme/tokens";
import { mockEvents, MockEvent } from "@/lib/mockData";

const STATUS_BG: Record<MockEvent["status"], keyof typeof colors> = {
  LIVE: "pink",
  OPEN: "lime",
  RESOLVING: "sun",
  CLOSED: "ash",
};

function StatusPill({ status }: { status: MockEvent["status"] }) {
  const bg = STATUS_BG[status];
  const fg = bg === "ash" ? "chalk" : "ink";
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: colors[bg],
        borderColor: colors.ink,
        borderWidth: border.thick,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Text
        style={{
          color: colors[fg],
          fontWeight: "900",
          fontSize: 11,
          letterSpacing: 1.2,
        }}
      >
        {status === "LIVE" ? "● LIVE NOW" : status}
      </Text>
    </View>
  );
}

function EventRow({ event }: { event: MockEvent }) {
  return (
    <Pressable>
      <BrutalCard bg={event.accent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <StatusPill status={event.status} />
          <Text
            style={{
              fontFamily: "Courier",
              fontWeight: "900",
              color: colors.ink,
              fontSize: 13,
            }}
          >
            {event.startsAt}
          </Text>
        </View>

        <Text
          style={{
            marginTop: 14,
            fontSize: 26,
            fontWeight: "900",
            color: colors.ink,
            letterSpacing: -0.6,
            textTransform: "uppercase",
          }}
        >
          {event.title}
        </Text>

        <Text
          style={{
            marginTop: 4,
            color: colors.ink,
            fontWeight: "700",
            fontSize: 13,
          }}
        >
          BY {event.creator.toUpperCase()}
        </Text>

        <View
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTopColor: colors.ink,
            borderTopWidth: border.thick,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 10, fontWeight: "900", letterSpacing: 1 }}>
              PROPS
            </Text>
            <Text style={{ fontSize: 22, fontWeight: "900", color: colors.ink }}>
              {event.propsCount}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 10, fontWeight: "900", letterSpacing: 1 }}>
              POT
            </Text>
            <Text style={{ fontSize: 22, fontWeight: "900", color: colors.ink }}>
              {event.potTokens.toLocaleString()} ⚡
            </Text>
          </View>
        </View>
      </BrutalCard>
    </Pressable>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 16 }}>
      <View
        style={{
          width: 16,
          height: 16,
          backgroundColor: colors.ink,
          marginRight: 8,
        }}
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "900",
          color: colors.ink,
          letterSpacing: 2,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          height: border.thick,
          backgroundColor: colors.ink,
          marginLeft: 12,
        }}
      />
    </View>
  );
}

export default function HomeScreen() {
  const live = mockEvents.filter((e) => e.status === "LIVE" || e.status === "RESOLVING");
  const upcoming = mockEvents.filter((e) => e.status === "OPEN");

  return (
    <ScreenFrame
      title="Action"
      subtitle="The bets your friends are running"
      accent="lime"
    >
      <SectionHeader label="LIVE & RESOLVING" />
      {live.map((e) => (
        <EventRow key={e.id} event={e} />
      ))}

      <SectionHeader label="UPCOMING" />
      {upcoming.map((e) => (
        <EventRow key={e.id} event={e} />
      ))}
    </ScreenFrame>
  );
}
