import { ReactNode } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/tokens";

type Props = {
  title: string;
  trailing?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
};

export function ScreenFrame({ title, trailing, children, scroll = true }: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <StatusBar barStyle="dark-content" />
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.bg,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: colors.text,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </Text>
        {trailing}
      </View>
      <Body
        style={{ flex: 1, backgroundColor: colors.bgSubtle }}
        contentContainerStyle={
          scroll ? { padding: 16, paddingBottom: 60 } : undefined
        }
      >
        {children}
      </Body>
    </SafeAreaView>
  );
}
