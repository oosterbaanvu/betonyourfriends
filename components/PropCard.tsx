import { Pressable, Text, View, Image, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import { MockProp } from "@/lib/mockData";
import { asCents, impliedYesProb, impliedNoProb } from "@/lib/odds";
import { useStore } from "@/lib/store";

type Props = {
  prop: MockProp;
  onTapWager: (prop: MockProp, side: "YES" | "NO") => void;
};

function ProbabilityBar({ yesProb }: { yesProb: number }) {
  return (
    <View
      style={{
        height: 10,
        backgroundColor: colors.no,
        flexDirection: "row",
        borderColor: colors.ink,
        borderWidth: border.hairline,
      }}
    >
      <View style={{ flex: yesProb, backgroundColor: colors.yes }} />
      <View style={{ flex: 1 - yesProb }} />
    </View>
  );
}

function YesNoBlock({
  side,
  cents,
  onPress,
  active,
}: {
  side: "YES" | "NO";
  cents: string;
  onPress: () => void;
  active?: boolean;
}) {
  const isYes = side === "YES";
  const bg = isYes ? colors.lime : colors.blood;
  const fg = isYes ? colors.ink : colors.chalk;
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <View
        style={{
          position: "relative",
          marginRight: 4,
          marginBottom: 4,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            right: -4,
            bottom: -4,
            backgroundColor: colors.ink,
          }}
        />
        <View
          style={{
            backgroundColor: bg,
            borderColor: colors.ink,
            borderWidth: border.brutal,
            paddingVertical: 12,
            alignItems: "center",
            opacity: active ? 1 : 1,
          }}
        >
          <Text
            style={{
              color: fg,
              fontSize: 13,
              fontWeight: "900",
              letterSpacing: 1.4,
            }}
          >
            {side}
          </Text>
          <Text
            style={{
              color: fg,
              fontSize: 18,
              fontWeight: "900",
              fontVariant: ["tabular-nums"],
              marginTop: 2,
            }}
          >
            {cents}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function VoteRow({ prop }: { prop: MockProp }) {
  const { castVote, votes } = useStore();
  const myVote = votes[prop.id];

  const pickPhoto = async () => {
    const perms = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perms.granted) {
      if (Platform.OS !== "web") {
        Alert.alert("Permission needed", "Allow photo access to attach evidence.");
      }
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets[0]) {
      castVote(prop.id, myVote?.side ?? "YES", res.assets[0].uri);
    }
  };

  const cast = (side: "YES" | "NO") => {
    castVote(prop.id, side, myVote?.photoUri);
  };

  const totalCast = prop.votes.yes + prop.votes.no;

  return (
    <View>
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: colors.warnBg,
          borderColor: colors.ink,
          borderWidth: border.thick,
          paddingHorizontal: 8,
          paddingVertical: 3,
          marginBottom: 12,
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
          AWAITING VERDICT
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        <Pressable onPress={() => cast("YES")} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor:
                myVote?.side === "YES" ? colors.lime : colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.thick,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.ink,
                fontSize: 12,
                fontWeight: "900",
                letterSpacing: 1.2,
              }}
            >
              IT HAPPENED
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => cast("NO")} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor:
                myVote?.side === "NO" ? colors.blood : colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.thick,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: myVote?.side === "NO" ? colors.chalk : colors.ink,
                fontSize: 12,
                fontWeight: "900",
                letterSpacing: 1.2,
              }}
            >
              DIDN'T HAPPEN
            </Text>
          </View>
        </Pressable>
      </View>

      <Pressable
        onPress={pickPhoto}
        style={{
          borderColor: colors.ink,
          borderWidth: border.thick,
          backgroundColor: colors.bone,
          paddingVertical: 12,
          alignItems: "center",
          marginBottom: 12,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="camera"
          size={14}
          color={colors.ink}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            color: colors.ink,
            fontWeight: "900",
            fontSize: 12,
            letterSpacing: 1.2,
          }}
        >
          {myVote?.photoUri ? "REPLACE EVIDENCE" : "ATTACH EVIDENCE"}
        </Text>
      </Pressable>

      {myVote?.photoUri ? (
        <Image
          source={{ uri: myVote.photoUri }}
          style={{
            width: "100%",
            height: 160,
            borderColor: colors.ink,
            borderWidth: border.thick,
            marginBottom: 12,
            backgroundColor: colors.bone,
          }}
          resizeMode="cover"
        />
      ) : null}

      <Text
        style={{
          color: colors.textMuted,
          fontSize: 11,
          fontWeight: "900",
          letterSpacing: 1.2,
          fontFamily: "Courier",
        }}
      >
        {totalCast} OF {prop.voterCount} VOTED, {prop.votes.yes} YES /{" "}
        {prop.votes.no} NO
      </Text>
    </View>
  );
}

function ResolvedRow({ prop }: { prop: MockProp }) {
  const { positions } = useStore();
  const pos = positions[prop.id];
  const won = pos && prop.resolvedSide === pos.side;
  const isYes = prop.resolvedSide === "YES";
  return (
    <View>
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: isYes ? colors.lime : colors.blood,
          borderColor: colors.ink,
          borderWidth: border.thick,
          paddingHorizontal: 8,
          paddingVertical: 3,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            color: isYes ? colors.ink : colors.chalk,
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.4,
          }}
        >
          RESOLVED {prop.resolvedSide}
        </Text>
      </View>
      {pos ? (
        <Text
          style={{
            color: colors.ink,
            fontSize: 13,
            fontWeight: "700",
            fontFamily: "Courier",
          }}
        >
          YOU BET {pos.amount} ON {pos.side},{" "}
          <Text
            style={{
              color: won ? colors.yes : colors.no,
              fontWeight: "900",
            }}
          >
            {won ? "WON" : "LOST"}
          </Text>
        </Text>
      ) : (
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 12,
            fontFamily: "Courier",
            fontWeight: "700",
          }}
        >
          YOU DIDN'T BET ON THIS ONE.
        </Text>
      )}
    </View>
  );
}

export function PropCard({ prop, onTapWager }: Props) {
  const { positions } = useStore();
  const pos = positions[prop.id];
  const yesProb = impliedYesProb(prop);
  const noProb = impliedNoProb(prop);
  const volume = prop.yesPool + prop.noPool;

  return (
    <View style={{ position: "relative", marginRight: 5, marginBottom: 14 }}>
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
          backgroundColor: colors.chalk,
          borderColor: colors.ink,
          borderWidth: border.brutal,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            fontWeight: "900",
            color: colors.ink,
            letterSpacing: -0.3,
            lineHeight: 22,
            textTransform: "uppercase",
          }}
        >
          {prop.description}
        </Text>

        {prop.status === "OPEN" ? (
          <>
            <View style={{ marginTop: 14, marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.yes,
                    fontSize: 11,
                    fontWeight: "900",
                    letterSpacing: 1.2,
                  }}
                >
                  YES {asCents(yesProb)}
                </Text>
                <Text
                  style={{
                    color: colors.no,
                    fontSize: 11,
                    fontWeight: "900",
                    letterSpacing: 1.2,
                  }}
                >
                  NO {asCents(noProb)}
                </Text>
              </View>
              <ProbabilityBar yesProb={yesProb} />
            </View>

            <View style={{ flexDirection: "row" }}>
              <YesNoBlock
                side="YES"
                cents={asCents(yesProb)}
                active={pos?.side === "YES"}
                onPress={() => onTapWager(prop, "YES")}
              />
              <View style={{ width: 4 }} />
              <YesNoBlock
                side="NO"
                cents={asCents(noProb)}
                active={pos?.side === "NO"}
                onPress={() => onTapWager(prop, "NO")}
              />
            </View>

            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 11,
                  fontWeight: "900",
                  fontFamily: "Courier",
                  letterSpacing: 1.2,
                }}
              >
                VOL {volume.toLocaleString()}
              </Text>
              {pos ? (
                <Text
                  style={{
                    color: pos.side === "YES" ? colors.yes : colors.no,
                    fontSize: 11,
                    fontWeight: "900",
                    fontFamily: "Courier",
                    letterSpacing: 1.2,
                  }}
                >
                  YOU: {pos.amount} ON {pos.side}
                </Text>
              ) : null}
            </View>
          </>
        ) : prop.status === "AWAITING_VERDICT" ? (
          <View style={{ marginTop: 14 }}>
            <VoteRow prop={prop} />
          </View>
        ) : (
          <View style={{ marginTop: 14 }}>
            <ResolvedRow prop={prop} />
          </View>
        )}
      </View>
    </View>
  );
}
