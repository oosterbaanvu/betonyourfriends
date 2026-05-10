import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StoreProvider } from "@/lib/store";
import { GameSessionProvider } from "@/lib/gameSession";
import { colors } from "@/theme/tokens";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StoreProvider>
          <GameSessionProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.bone },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="judgment"
                options={{ animation: "fade_from_bottom" }}
              />
              <Stack.Screen
                name="event/[id]"
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="game/party-launch"
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="game/[sessionId]/lobby"
                options={{ animation: "fade_from_bottom" }}
              />
              <Stack.Screen
                name="game/[sessionId]/play"
                options={{ animation: "fade" }}
              />
              <Stack.Screen
                name="game/[sessionId]/final"
                options={{ animation: "fade_from_bottom" }}
              />
            </Stack>
          </GameSessionProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
