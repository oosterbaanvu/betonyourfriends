import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { colors, radius } from "@/theme/tokens";
import { MockProp } from "@/lib/mockData";
import { asCents, estimatePayout, impliedYesProb, impliedNoProb } from "@/lib/odds";
import { useStore } from "@/lib/store";

type Props = {
  prop: MockProp | null;
  initialSide: "YES" | "NO";
  onClose: () => void;
};

const QUICK_STAKES = [25, 100, 250, 500] as const;

export function WagerSheet({ prop, initialSide, onClose }: Props) {
  const { balance, placeBet } = useStore();
  const [side, setSide] = useState<"YES" | "NO">(initialSide);
  const [stakeText, setStakeText] = useState<string>("100");

  useEffect(() => {
    if (prop) {
      setSide(initialSide);
      setStakeText("100");
    }
  }, [prop, initialSide]);

  if (!prop) return null;

  const stake = Math.max(0, Math.floor(Number(stakeText) || 0));
  const yesProb = impliedYesProb(prop);
  const noProb = impliedNoProb(prop);
  const cents = side === "YES" ? asCents(yesProb) : asCents(noProb);
  const gross = estimatePayout(prop, side, stake);
  const net = gross - stake;
  const tooMuch = stake > balance;

  const confirm = () => {
    if (stake <= 0) return;
    const result = placeBet(prop.id, side, stake);
    if (!result.ok) {
      if (Platform.OS !== "web") {
        Alert.alert("Couldn't place bet", result.reason);
      } else if (typeof window !== "undefined") {
        window.alert(result.reason);
      }
      return;
    }
    onClose();
  };

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          justifyContent: "flex-end",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable onPress={() => {}}>
            <View
              style={{
                backgroundColor: colors.bg,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                paddingBottom: 32,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.borderStrong,
                  marginBottom: 14,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.text,
                  marginBottom: 4,
                  letterSpacing: -0.2,
                }}
                numberOfLines={2}
              >
                {prop.description}
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 13,
                  fontWeight: "500",
                  marginBottom: 18,
                }}
              >
                Balance {balance.toLocaleString()}⚡
              </Text>

              {/* Yes/No segmented control */}
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: colors.bgInset,
                  borderRadius: radius.md,
                  padding: 4,
                  marginBottom: 18,
                }}
              >
                {(["YES", "NO"] as const).map((s) => {
                  const isActive = side === s;
                  const fg = s === "YES" ? colors.yes : colors.no;
                  return (
                    <Pressable
                      key={s}
                      onPress={() => setSide(s)}
                      style={{
                        flex: 1,
                        backgroundColor: isActive ? colors.bg : "transparent",
                        borderRadius: radius.sm,
                        paddingVertical: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: isActive ? fg : colors.textMuted,
                          fontWeight: "700",
                          fontSize: 14,
                        }}
                      >
                        {s}{" "}
                        <Text style={{ fontVariant: ["tabular-nums"] }}>
                          {asCents(s === "YES" ? yesProb : noProb)}
                        </Text>
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Stake input */}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: colors.textMuted,
                  marginBottom: 6,
                }}
              >
                Stake (⚡)
              </Text>
              <TextInput
                value={stakeText}
                onChangeText={setStakeText}
                keyboardType="number-pad"
                style={{
                  borderWidth: 1,
                  borderColor: tooMuch ? colors.no : colors.border,
                  borderRadius: radius.md,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  fontSize: 22,
                  fontWeight: "700",
                  color: colors.text,
                  fontVariant: ["tabular-nums"],
                  marginBottom: 10,
                }}
              />

              <View style={{ flexDirection: "row", marginBottom: 18 }}>
                {QUICK_STAKES.map((q) => (
                  <Pressable
                    key={q}
                    onPress={() => setStakeText(String(q))}
                    style={{
                      flex: 1,
                      marginRight: 6,
                      paddingVertical: 8,
                      backgroundColor: colors.bgInset,
                      borderRadius: radius.sm,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "600", color: colors.text, fontSize: 13 }}>
                      {q}⚡
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setStakeText(String(balance))}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    backgroundColor: colors.bgInset,
                    borderRadius: radius.sm,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontWeight: "700", color: colors.text, fontSize: 13 }}>
                    Max
                  </Text>
                </Pressable>
              </View>

              {/* Payout preview */}
              <View
                style={{
                  backgroundColor: colors.bgInset,
                  borderRadius: radius.md,
                  padding: 14,
                  marginBottom: 18,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                    Implied odds
                  </Text>
                  <Text
                    style={{
                      fontWeight: "700",
                      color: colors.text,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {cents}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                    If {side} hits, you receive
                  </Text>
                  <Text
                    style={{
                      fontWeight: "700",
                      color: colors.text,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {Math.round(gross).toLocaleString()}⚡
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                    Profit
                  </Text>
                  <Text
                    style={{
                      fontWeight: "700",
                      color: net > 0 ? colors.yes : colors.text,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    +{Math.round(net).toLocaleString()}⚡
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={confirm}
                disabled={stake <= 0 || tooMuch}
                style={{
                  backgroundColor:
                    stake <= 0 || tooMuch
                      ? colors.borderStrong
                      : side === "YES"
                      ? colors.yes
                      : colors.no,
                  borderRadius: radius.md,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: 16,
                  }}
                >
                  {tooMuch
                    ? "Not enough tokens"
                    : stake <= 0
                    ? "Enter a stake"
                    : `Confirm · Bet ${stake.toLocaleString()}⚡ on ${side}`}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
