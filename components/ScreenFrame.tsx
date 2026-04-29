import { ReactNode } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, border } from "@/theme/tokens";

type Props = {
  title: string;
  trailing?: ReactNode;
  leading?: ReactNode;
  accent?: keyof typeof colors;
  children: ReactNode;
  scroll?: boolean;
};

/**
 * Brutalist screen header: a slab of color with a 5px black underrule.
 * Use `accent` to set the slab color (defaults to chalk for a quieter feel).
 */
export function ScreenFrame({
  title,
  trailing,
  leading,
  accent = "chalk",
  children,
  scroll = true,
}: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.bone }}
    >
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          backgroundColor: colors[accent],
          borderBottomColor: colors.ink,
          borderBottomWidth: border.brutal,
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 16,
        }}
      >
        {leading ? <View style={{ marginBottom: 8 }}>{leading}</View> : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "900",
              color: colors.ink,
              letterSpacing: -1,
              textTransform: "uppercase",
            }}
          >
            {title}
          </Text>
          {trailing}
        </View>
      </View>
      <Body
        style={{ flex: 1, backgroundColor: colors.bone }}
        contentContainerStyle={
          scroll ? { padding: 16, paddingBottom: 60 } : undefined
        }
      >
        {children}
      </Body>
    </SafeAreaView>
  );
}
