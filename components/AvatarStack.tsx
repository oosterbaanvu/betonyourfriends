import { View, Text } from "react-native";
import { colors } from "@/theme/tokens";
import { Friend } from "@/lib/mockData";

const PALETTE = [
  "#2563EB",
  "#DB2777",
  "#059669",
  "#EA580C",
  "#7C3AED",
  "#0891B2",
  "#CA8A04",
];

function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function initial(handle: string): string {
  const stripped = handle.replace(/^@/, "");
  return (stripped[0] || "?").toUpperCase();
}

type Props = {
  friends: Friend[];
  size?: number;
  max?: number;
};

export function AvatarStack({ friends, size = 26, max = 4 }: Props) {
  const visible = friends.slice(0, max);
  const overflow = friends.length - visible.length;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {visible.map((f, i) => (
        <View
          key={f.id}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colorFor(f.id),
            borderWidth: 2,
            borderColor: colors.bg,
            marginLeft: i === 0 ? 0 : -size / 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: size * 0.42,
            }}
          >
            {initial(f.handle)}
          </Text>
        </View>
      ))}
      {overflow > 0 ? (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.bgInset,
            borderWidth: 2,
            borderColor: colors.bg,
            marginLeft: -size / 3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.textMuted,
              fontWeight: "700",
              fontSize: size * 0.36,
            }}
          >
            +{overflow}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
