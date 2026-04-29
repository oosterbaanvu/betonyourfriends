import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { colors } from "@/theme/tokens";

type IconProps = { focused: boolean; glyph: string };

function TabGlyph({ focused, glyph }: IconProps) {
  return (
    <View
      style={{
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: focused ? colors.text : colors.textFaint,
        }}
      >
        {glyph}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 78,
          paddingTop: 8,
          paddingBottom: 18,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textFaint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Markets",
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} glyph="◇" />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} glyph="+" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} glyph="○" />,
        }}
      />
    </Tabs>
  );
}
