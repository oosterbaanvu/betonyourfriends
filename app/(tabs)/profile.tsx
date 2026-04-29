import { View, Text } from "react-native";
import { ScreenFrame } from "@/components/ScreenFrame";
import { BrutalCard } from "@/components/BrutalCard";
import { BrutalButton } from "@/components/BrutalButton";
import { colors, radius } from "@/theme/tokens";

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textMuted }}>
        {label}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: colors.text,
          marginTop: 2,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function VerdictRow({
  prop,
  side,
  delta,
  win,
}: {
  prop: string;
  side: "YES" | "NO";
  delta: string;
  win: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text
          style={{ fontSize: 14, fontWeight: "600", color: colors.text }}
          numberOfLines={2}
        >
          {prop}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.textMuted,
            marginTop: 2,
          }}
        >
          You bet {side}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: win ? colors.yes : colors.no,
          fontVariant: ["tabular-nums"],
        }}
      >
        {delta}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <ScreenFrame title="Profile">
      <BrutalCard padding={20}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.pill,
              backgroundColor: colors.bgInset,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "700", color: colors.text }}>
              J
            </Text>
          </View>
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.text,
                letterSpacing: -0.2,
              }}
            >
              @jules
            </Text>
            <Text
              style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}
            >
              Member since April 2026
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 18,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <StatCell label="Tokens" value="2,840" />
          <StatCell label="Prophet score" value="84" />
          <StatCell label="Wins" value="27" />
        </View>
      </BrutalCard>

      <BrutalCard padding={0}>
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text }}>
            Recent verdicts
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <VerdictRow
            prop="Mark spilled his drink before midnight"
            side="YES"
            delta="+320 ⚡"
            win
          />
          <VerdictRow
            prop="Romi ate four slices of pizza"
            side="NO"
            delta="−100 ⚡"
            win={false}
          />
          <VerdictRow
            prop="Steve attempted Bohemian Rhapsody at karaoke"
            side="YES"
            delta="+180 ⚡"
            win
          />
        </View>
      </BrutalCard>

      <BrutalButton label="Sign out" variant="secondary" fullWidth />
    </ScreenFrame>
  );
}
