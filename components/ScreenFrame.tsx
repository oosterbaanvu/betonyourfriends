import { ReactNode } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, border } from "@/theme/tokens";

type Props = {
  title: string;
  subtitle?: string;
  accent?: keyof typeof colors;
  children: ReactNode;
  scroll?: boolean;
};

export function ScreenFrame({
  title,
  subtitle,
  accent = "lime",
  children,
  scroll = true,
}: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bone }}>
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          backgroundColor: colors[accent],
          borderBottomColor: colors.ink,
          borderBottomWidth: border.brutal,
          paddingHorizontal: 20,
          paddingVertical: 18,
        }}
      >
        <Text
          style={{
            fontSize: 36,
            fontWeight: "900",
            color: colors.ink,
            letterSpacing: -1,
            textTransform: "uppercase",
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              marginTop: 4,
              fontSize: 14,
              fontWeight: "700",
              color: colors.ink,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Body
        style={{ flex: 1 }}
        contentContainerStyle={
          scroll ? { padding: 20, paddingBottom: 60 } : undefined
        }
      >
        {children}
      </Body>
    </SafeAreaView>
  );
}
