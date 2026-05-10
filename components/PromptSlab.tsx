import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { colors, border } from "@/theme/tokens";

type Props = {
  prompt: string;
  roundNumber: number;
  totalRounds: number;
};

/**
 * Full-bleed prompt card that slams in from the top with a percussive bounce.
 * No soft easing — keep it brutalist.
 */
export function PromptSlab({ prompt, roundNumber, totalRounds }: Props) {
  const slam = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slam.setValue(0);
    Animated.sequence([
      Animated.timing(slam, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.back(2.4)),
        useNativeDriver: true,
      }),
      Animated.timing(slam, {
        toValue: 0.95,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(slam, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [prompt, slam]);

  const translateY = slam.interpolate({
    inputRange: [0, 1],
    outputRange: [-260, 0],
  });
  const rotate = slam.interpolate({
    inputRange: [0, 1],
    outputRange: ["-3deg", "0deg"],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY }, { rotate }],
        marginHorizontal: 12,
      }}
    >
      <View style={{ position: "relative", marginRight: 8, marginBottom: 14 }}>
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            right: -8,
            bottom: -8,
            backgroundColor: colors.ink,
          }}
        />
        <View
          style={{
            backgroundColor: colors.lime,
            borderColor: colors.ink,
            borderWidth: border.brutal,
            padding: 22,
            minHeight: 220,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                color: colors.ink,
                fontFamily: "Courier",
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.6,
              }}
            >
              ROUND {String(roundNumber).padStart(2, "0")} / {String(totalRounds).padStart(2, "0")}
            </Text>
            <Text
              style={{
                color: colors.ink,
                fontFamily: "Courier",
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 1.6,
              }}
            >
              WHO'S MOST LIKELY
            </Text>
          </View>
          <Text
            style={{
              color: colors.ink,
              fontSize: 28,
              lineHeight: 34,
              fontWeight: "900",
              letterSpacing: -0.8,
              textTransform: "uppercase",
            }}
          >
            {prompt}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
