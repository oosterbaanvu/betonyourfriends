import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import { useStore } from "@/lib/store";
import { mirrorStateFor } from "@/lib/mockData";

function usePulse(active: boolean) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) {
      v.stopAnimation();
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(v, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, v]);
  return v;
}

function MirrorTile({
  pendingCount,
  secretCount,
  onPress,
}: {
  pendingCount: number;
  secretCount: number;
  onPress: () => void;
}) {
  const isPending = pendingCount > 0;
  const pulse = usePulse(isPending);

  // Border / outer color animates between ink and lime when pulsing.
  const borderColor = isPending
    ? pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.ink, colors.lime],
      })
    : colors.ink;

  const headlineCount = isPending ? pendingCount : secretCount;
  const headlineLabel = isPending
    ? pendingCount === 1
      ? "VERDICT NEEDS YOU"
      : "VERDICTS NEED YOU"
    : "SECRET BETS ON YOU";

  const subtitle = isPending
    ? "Tap to confess or deny"
    : secretCount === 0
    ? "All clear. Nobody is watching."
    : "Tracking your behavior...";

  const bg = isPending ? colors.lime : colors.ink;
  const fg = isPending ? colors.ink : colors.chalk;
  const muted = isPending ? "#1A2A00" : "#A1A1A1";

  return (
    <Pressable
      onPress={isPending ? onPress : undefined}
      disabled={!isPending}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          position: "relative",
          marginRight: 6,
          marginBottom: 6,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            right: -6,
            bottom: -6,
            backgroundColor: colors.ink,
          }}
        />
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: bg,
            borderColor: borderColor as any,
            borderWidth: border.brutal,
            padding: 22,
            justifyContent: "space-between",
          }}
        >
          {/* Top row: label + icon */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text
              style={{
                color: muted,
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 2,
                fontFamily: "Courier",
              }}
            >
              [ THE MIRROR ]
            </Text>
            <View
              style={{
                width: 38,
                height: 38,
                borderColor: fg,
                borderWidth: border.thick,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={isPending ? "alert" : "eye-off"}
                size={20}
                color={fg}
              />
            </View>
          </View>

          {/* Big counter */}
          <View>
            <Text
              style={{
                color: fg,
                fontSize: 96,
                fontWeight: "900",
                letterSpacing: -4,
                lineHeight: 100,
                fontVariant: ["tabular-nums"],
              }}
            >
              {String(headlineCount).padStart(2, "0")}
            </Text>
            <Text
              style={{
                color: fg,
                fontSize: 17,
                fontWeight: "900",
                letterSpacing: 1.5,
                marginTop: -4,
              }}
            >
              {headlineLabel}
            </Text>
          </View>

          {/* Subtitle */}
          <View
            style={{
              borderTopColor: fg,
              borderTopWidth: border.hairline,
              paddingTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: muted,
                fontSize: 12,
                fontWeight: "700",
                letterSpacing: 0.6,
              }}
            >
              {subtitle}
            </Text>
            {isPending ? (
              <Ionicons name="arrow-forward" size={16} color={fg} />
            ) : null}
          </View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

function PitTile({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          position: "relative",
          marginRight: 6,
          marginBottom: 6,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            right: -6,
            bottom: -6,
            backgroundColor: colors.ink,
          }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: colors.chalk,
            borderColor: colors.ink,
            borderWidth: border.brutal,
            padding: 22,
            justifyContent: "space-between",
          }}
        >
          {/* Top row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: "900",
                letterSpacing: 2,
                fontFamily: "Courier",
              }}
            >
              [ THE PIT ]
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: colors.lime,
                borderColor: colors.ink,
                borderWidth: border.thick,
              }}
            >
              <Text
                style={{
                  color: colors.ink,
                  fontSize: 10,
                  fontWeight: "900",
                  letterSpacing: 1.4,
                }}
              >
                LIVE
              </Text>
            </View>
          </View>

          {/* Display */}
          <View>
            <Text
              style={{
                color: colors.ink,
                fontSize: 64,
                fontWeight: "900",
                letterSpacing: -3,
                lineHeight: 64,
              }}
            >
              ENTER
            </Text>
            <Text
              style={{
                color: colors.ink,
                fontSize: 28,
                fontWeight: "900",
                letterSpacing: -1,
                marginTop: 2,
              }}
            >
              MAIN MARKET
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 13,
                fontWeight: "700",
                marginTop: 8,
                letterSpacing: 0.5,
              }}
            >
              Bet on your friends.
            </Text>
          </View>

          {/* CTA row */}
          <View
            style={{
              borderTopColor: colors.ink,
              borderTopWidth: border.hairline,
              paddingTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: colors.ink,
                fontSize: 12,
                fontWeight: "900",
                letterSpacing: 1.4,
              }}
            >
              TAP TO ENTER
            </Text>
            <Ionicons name="arrow-forward" size={18} color={colors.ink} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function Landing() {
  const router = useRouter();
  const { props, viewerId, balance } = useStore();
  const { secretCount, pendingCount } = mirrorStateFor(viewerId, props);

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bone }}>
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              color: colors.ink,
              fontSize: 11,
              fontWeight: "900",
              letterSpacing: 1.6,
              fontFamily: "Courier",
            }}
          >
            BET ON YOUR FRIENDS
          </Text>
          <Text
            style={{
              color: colors.ink,
              fontSize: 30,
              fontWeight: "900",
              letterSpacing: -1.2,
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            @jules
          </Text>
        </View>
        <View
          style={{
            backgroundColor: colors.chalk,
            borderColor: colors.ink,
            borderWidth: border.thick,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 9,
              fontWeight: "900",
              letterSpacing: 1.2,
            }}
          >
            BALANCE
          </Text>
          <Text
            style={{
              color: colors.ink,
              fontSize: 20,
              fontWeight: "900",
              fontVariant: ["tabular-nums"],
              letterSpacing: -0.5,
            }}
          >
            {balance.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Heavy black divider rule */}
      <View style={{ height: border.brutal, backgroundColor: colors.ink }} />

      {/* Two stacked tiles */}
      <View style={{ flex: 1, padding: 16, paddingBottom: 22 }}>
        <MirrorTile
          pendingCount={pendingCount}
          secretCount={secretCount}
          onPress={() => router.push("/judgment")}
        />
        <PitTile onPress={() => router.push("/markets")} />
      </View>
    </SafeAreaView>
  );
}
