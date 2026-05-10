import { useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenFrame } from "@/components/ScreenFrame";
import { colors, border } from "@/theme/tokens";
import { useStore } from "@/lib/store";

const SUGGESTIONS = [
  "Friday Night",
  "Game of darts",
  "Sunday roast",
  "Karaoke",
  "Beach day",
  "Champions League final",
];

export default function CreateScreen() {
  const router = useRouter();
  const { createGame } = useStore();
  const [title, setTitle] = useState("");
  const shake = useRef(new Animated.Value(0)).current;

  const canSubmit = title.trim().length > 0;

  const onCreate = () => {
    if (!canSubmit) {
      Animated.sequence([
        Animated.timing(shake, { toValue: 8, duration: 60, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -8, duration: 60, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, easing: Easing.linear, useNativeDriver: true }),
      ]).start();
      return;
    }
    const res = createGame(title);
    if (res.ok) router.push(`/lobby/${res.id}`);
  };

  return (
    <ScreenFrame title="New game" accent="pink">
      <Text
        style={{
          color: colors.ink,
          fontSize: 28,
          fontWeight: "900",
          letterSpacing: -0.8,
          textTransform: "uppercase",
          marginTop: 6,
          lineHeight: 32,
        }}
      >
        What are you{`\n`}playing tonight?
      </Text>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: "Courier",
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.6,
          marginTop: 8,
          marginBottom: 22,
        }}
      >
        Give it a name. Bring your friends. Bet on anything that happens.
      </Text>

      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <View style={{ position: "relative", marginRight: 5, marginBottom: 16 }}>
          <View
            style={{
              position: "absolute",
              top: 5,
              left: 5,
              right: -5,
              bottom: -5,
              backgroundColor: colors.ink,
            }}
          />
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Friday Night"
            placeholderTextColor={colors.textFaint}
            autoFocus
            style={{
              backgroundColor: colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.brutal,
              paddingHorizontal: 18,
              paddingVertical: 22,
              fontSize: 26,
              fontWeight: "900",
              color: colors.ink,
              letterSpacing: -0.6,
            }}
            onSubmitEditing={onCreate}
            returnKeyType="go"
          />
        </View>
      </Animated.View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 22 }}>
        {SUGGESTIONS.map((s) => (
          <Pressable
            key={s}
            onPress={() => setTitle(s)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.thick,
            }}
          >
            <Text
              style={{
                color: colors.ink,
                fontFamily: "Courier",
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1,
              }}
            >
              {s.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onCreate}>
        <View style={{ position: "relative", marginRight: 5, marginBottom: 5 }}>
          <View
            style={{
              position: "absolute",
              top: 5,
              left: 5,
              right: -5,
              bottom: -5,
              backgroundColor: colors.ink,
            }}
          />
          <View
            style={{
              backgroundColor: canSubmit ? colors.lime : colors.borderSoft,
              borderColor: colors.ink,
              borderWidth: border.brutal,
              paddingVertical: 22,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="flash" size={20} color={colors.ink} />
            <Text
              style={{
                marginLeft: 8,
                color: colors.ink,
                fontWeight: "900",
                fontSize: 18,
                letterSpacing: 1.4,
              }}
            >
              CREATE GAME
            </Text>
          </View>
        </View>
      </Pressable>

      <Text
        style={{
          color: colors.textMuted,
          fontFamily: "Courier",
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.6,
          marginTop: 14,
          textAlign: "center",
        }}
      >
        NEXT STEP: SHARE THE JOIN CODE WITH YOUR FRIENDS
      </Text>
    </ScreenFrame>
  );
}
