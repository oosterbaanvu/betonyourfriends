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
import { colors, border } from "@/theme/tokens";
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
  const sideColor = side === "YES" ? colors.lime : colors.blood;
  const sideFg = side === "YES" ? colors.ink : colors.chalk;

  const confirm = () => {
    if (stake <= 0) return;
    const result = placeBet(prop.id, side, stake);
    if (!result.ok) {
      if (Platform.OS !== "web") Alert.alert("Couldn't place bet", result.reason);
      else if (typeof window !== "undefined") window.alert(result.reason);
      return;
    }
    onClose();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(10, 10, 10, 0.55)",
          justifyContent: "flex-end",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable onPress={() => {}}>
            <View
              style={{
                backgroundColor: colors.chalk,
                borderTopColor: colors.ink,
                borderTopWidth: border.brutal,
                padding: 20,
                paddingBottom: 32,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  width: 44,
                  height: 5,
                  backgroundColor: colors.ink,
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "900",
                  color: colors.textMuted,
                  letterSpacing: 1.6,
                  fontFamily: "Courier",
                  marginBottom: 6,
                }}
              >
                PLACING WAGER
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "900",
                  color: colors.ink,
                  marginBottom: 4,
                  letterSpacing: -0.4,
                  textTransform: "uppercase",
                  lineHeight: 27,
                }}
                numberOfLines={3}
              >
                {prop.description}
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 11,
                  fontWeight: "900",
                  fontFamily: "Courier",
                  marginBottom: 18,
                  letterSpacing: 1,
                }}
              >
                BALANCE {balance.toLocaleString()}
              </Text>

              {/* Yes/No segmented */}
              <View
                style={{
                  flexDirection: "row",
                  borderColor: colors.ink,
                  borderWidth: border.thick,
                  marginBottom: 18,
                }}
              >
                {(["YES", "NO"] as const).map((s, i) => {
                  const isActive = side === s;
                  const bg =
                    s === "YES"
                      ? isActive
                        ? colors.lime
                        : colors.chalk
                      : isActive
                      ? colors.blood
                      : colors.chalk;
                  const fg =
                    s === "NO" && isActive ? colors.chalk : colors.ink;
                  return (
                    <Pressable
                      key={s}
                      onPress={() => setSide(s)}
                      style={{
                        flex: 1,
                        backgroundColor: bg,
                        paddingVertical: 12,
                        alignItems: "center",
                        borderRightWidth: i === 0 ? border.thick : 0,
                        borderRightColor: colors.ink,
                      }}
                    >
                      <Text
                        style={{
                          color: fg,
                          fontWeight: "900",
                          fontSize: 14,
                          letterSpacing: 1.4,
                        }}
                      >
                        {s} {asCents(s === "YES" ? yesProb : noProb)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "900",
                  color: colors.textMuted,
                  letterSpacing: 1.4,
                  marginBottom: 6,
                }}
              >
                STAKE
              </Text>
              <TextInput
                value={stakeText}
                onChangeText={setStakeText}
                keyboardType="number-pad"
                style={{
                  borderColor: tooMuch ? colors.blood : colors.ink,
                  borderWidth: border.thick,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  fontSize: 26,
                  fontWeight: "900",
                  color: colors.ink,
                  fontVariant: ["tabular-nums"],
                  marginBottom: 10,
                  backgroundColor: colors.bone,
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
                      backgroundColor: colors.bone,
                      borderColor: colors.ink,
                      borderWidth: border.thick,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "900",
                        color: colors.ink,
                        fontSize: 13,
                      }}
                    >
                      {q}
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setStakeText(String(balance))}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    backgroundColor: colors.ink,
                    borderColor: colors.ink,
                    borderWidth: border.thick,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "900",
                      color: colors.chalk,
                      fontSize: 13,
                      letterSpacing: 1.2,
                    }}
                  >
                    MAX
                  </Text>
                </Pressable>
              </View>

              {/* Payout preview */}
              <View
                style={{
                  backgroundColor: colors.bone,
                  borderColor: colors.ink,
                  borderWidth: border.thick,
                  padding: 14,
                  marginBottom: 18,
                }}
              >
                <Row label="IMPLIED" value={cents} />
                <Row
                  label={`IF ${side} HITS`}
                  value={Math.round(gross).toLocaleString()}
                />
                <Row
                  label="PROFIT"
                  value={`+${Math.round(net).toLocaleString()}`}
                  valueColor={net > 0 ? colors.yes : colors.ink}
                  noBorder
                />
              </View>

              <Pressable
                onPress={confirm}
                disabled={stake <= 0 || tooMuch}
                style={{
                  backgroundColor:
                    stake <= 0 || tooMuch ? colors.borderSoft : sideColor,
                  borderColor: colors.ink,
                  borderWidth: border.brutal,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: stake <= 0 || tooMuch ? colors.ink : sideFg,
                    fontWeight: "900",
                    fontSize: 14,
                    letterSpacing: 1.4,
                  }}
                >
                  {tooMuch
                    ? "NOT ENOUGH TOKENS"
                    : stake <= 0
                    ? "ENTER A STAKE"
                    : `CONFIRM — BET ${stake.toLocaleString()} ON ${side}`}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function Row({
  label,
  value,
  valueColor = colors.ink,
  noBorder,
}: {
  label: string;
  value: string;
  valueColor?: string;
  noBorder?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: noBorder ? 0 : border.hairline,
        borderBottomColor: colors.borderSoft,
      }}
    >
      <Text
        style={{
          color: colors.textMuted,
          fontSize: 11,
          fontWeight: "900",
          letterSpacing: 1.2,
          fontFamily: "Courier",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: valueColor,
          fontWeight: "900",
          fontSize: 14,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
    </View>
  );
}
