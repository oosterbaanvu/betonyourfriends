import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { colors, border } from "@/theme/tokens";

type IconProps = { focused: boolean; glyph: string };

function TabGlyph({ focused, glyph }: IconProps) {
  return (
    <View
      style={{
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? colors.lime : "transparent",
        borderColor: colors.ink,
        borderWidth: focused ? border.thick : 0,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "900",
          color: colors.ink,
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
          backgroundColor: colors.chalk,
          borderTopColor: colors.ink,
          borderTopWidth: border.brutal,
          height: 88,
          paddingTop: 8,
          paddingBottom: 22,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "900",
          letterSpacing: 1,
          textTransform: "uppercase",
        },
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: "#7A7A7A",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} glyph="◆" />,
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
          tabBarIcon: ({ focused }) => <TabGlyph focused={focused} glyph="◉" />,
        }}
      />
    </Tabs>
  );
}
