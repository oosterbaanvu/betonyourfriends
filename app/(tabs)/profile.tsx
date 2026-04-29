import { View, Text } from "react-native";
import { ScreenFrame } from "@/components/ScreenFrame";
import { BrutalCard } from "@/components/BrutalCard";
import { BrutalButton } from "@/components/BrutalButton";
import { colors, border } from "@/theme/tokens";

function StatBlock({
  label,
  value,
  bg,
}: {
  label: string;
  value: string;
  bg: keyof typeof colors;
}) {
  return (
    <View style={{ flex: 1 }}>
      <BrutalCard bg={bg}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.5,
            color: colors.ink,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            marginTop: 6,
            fontSize: 38,
            fontWeight: "900",
            color: colors.ink,
            letterSpacing: -1.5,
          }}
        >
          {value}
        </Text>
      </BrutalCard>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <ScreenFrame title="Profile" subtitle="Your reputation. Your bankroll." accent="violet">
      <BrutalCard bg="ink">
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 72,
              height: 72,
              backgroundColor: colors.lime,
              borderColor: colors.chalk,
              borderWidth: border.brutal,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 32, fontWeight: "900", color: colors.ink }}>
              J
            </Text>
          </View>
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text
              style={{
                color: colors.chalk,
                fontSize: 24,
                fontWeight: "900",
                letterSpacing: -0.5,
                textTransform: "uppercase",
              }}
            >
              @jules
            </Text>
            <Text
              style={{
                color: colors.lime,
                fontSize: 12,
                fontWeight: "900",
                letterSpacing: 1.2,
                marginTop: 2,
              }}
            >
              CHAOS COMMISSIONER · LVL 7
            </Text>
          </View>
        </View>
      </BrutalCard>

      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <StatBlock label="TOKENS" value="2,840 ⚡" bg="lime" />
        <View style={{ width: 8 }} />
        <StatBlock label="PROPHET" value="84" bg="pink" />
      </View>

      <View style={{ flexDirection: "row" }}>
        <StatBlock label="WINS" value="27" bg="sun" />
        <View style={{ width: 8 }} />
        <StatBlock label="STREAK" value="5🔥" bg="chalk" />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 16 }}>
        <View style={{ width: 16, height: 16, backgroundColor: colors.ink, marginRight: 8 }} />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "900",
            letterSpacing: 2,
            color: colors.ink,
          }}
        >
          RECENT VERDICTS
        </Text>
        <View style={{ flex: 1, height: border.thick, backgroundColor: colors.ink, marginLeft: 12 }} />
      </View>

      <BrutalCard bg="chalk">
        <Text style={{ fontSize: 16, fontWeight: "900", color: colors.ink }}>
          MARK SPILLED HIS DRINK
        </Text>
        <Text style={{ marginTop: 4, fontWeight: "700", color: colors.ink }}>
          You bet YES · +320 ⚡
        </Text>
      </BrutalCard>

      <BrutalCard bg="chalk">
        <Text style={{ fontSize: 16, fontWeight: "900", color: colors.ink }}>
          ROMI ATE 4 SLICES
        </Text>
        <Text style={{ marginTop: 4, fontWeight: "700", color: colors.danger }}>
          You bet NO · −100 ⚡
        </Text>
      </BrutalCard>

      <View style={{ height: 16 }} />
      <BrutalButton label="Sign Out" bg="chalk" fullWidth />
    </ScreenFrame>
  );
}
