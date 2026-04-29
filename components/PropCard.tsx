import { Pressable, Text, View, Image, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors, radius } from "@/theme/tokens";
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
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.noFaint,
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      <View
        style={{
          flex: yesProb,
          backgroundColor: colors.yes,
        }}
      />
      <View style={{ flex: 1 - yesProb }} />
    </View>
  );
}

function YesNoButton({
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
  const fg = isYes ? colors.yes : colors.no;
  const faint = isYes ? colors.yesFaint : colors.noFaint;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: active ? fg : faint,
        borderWidth: 1,
        borderColor: active ? fg : faint,
        borderRadius: radius.md,
        paddingVertical: 12,
        opacity: pressed ? 0.85 : 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Text
        style={{
          color: active ? "#FFFFFF" : fg,
          fontWeight: "700",
          fontSize: 14,
          letterSpacing: 0.3,
          marginRight: 6,
        }}
      >
        {side}
      </Text>
      <Text
        style={{
          color: active ? "#FFFFFF" : fg,
          fontWeight: "700",
          fontSize: 14,
          fontVariant: ["tabular-nums"],
        }}
      >
        {cents}
      </Text>
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
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            backgroundColor: colors.warnFaint,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: radius.pill,
          }}
        >
          <Text style={{ color: colors.warn, fontSize: 12, fontWeight: "700" }}>
            ⏱ Awaiting verdict
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
        <Pressable
          onPress={() => cast("YES")}
          style={{
            flex: 1,
            backgroundColor: myVote?.side === "YES" ? colors.yes : colors.yesFaint,
            borderRadius: radius.md,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: myVote?.side === "YES" ? "#FFFFFF" : colors.yes,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            It happened
          </Text>
        </Pressable>
        <Pressable
          onPress={() => cast("NO")}
          style={{
            flex: 1,
            backgroundColor: myVote?.side === "NO" ? colors.no : colors.noFaint,
            borderRadius: radius.md,
            paddingVertical: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: myVote?.side === "NO" ? "#FFFFFF" : colors.no,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            Didn't happen
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={pickPhoto}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderStyle: "dashed",
          borderRadius: radius.md,
          paddingVertical: 14,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            color: colors.textMuted,
            fontWeight: "600",
            fontSize: 13,
          }}
        >
          {myVote?.photoUri ? "📷 Replace photo evidence" : "📷 Add photo evidence"}
        </Text>
      </Pressable>

      {myVote?.photoUri ? (
        <Image
          source={{ uri: myVote.photoUri }}
          style={{
            width: "100%",
            height: 160,
            borderRadius: radius.md,
            marginBottom: 10,
            backgroundColor: colors.bgInset,
          }}
          resizeMode="cover"
        />
      ) : null}

      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: "500" }}>
        {totalCast} of {prop.voterCount} voted · {prop.votes.yes} yes / {prop.votes.no} no
      </Text>
    </View>
  );
}

function ResolvedRow({ prop }: { prop: MockProp }) {
  const { positions } = useStore();
  const pos = positions[prop.id];
  const won = pos && prop.resolvedSide === pos.side;
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View
          style={{
            backgroundColor:
              prop.resolvedSide === "YES" ? colors.yesFaint : colors.noFaint,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: radius.pill,
          }}
        >
          <Text
            style={{
              color: prop.resolvedSide === "YES" ? colors.yes : colors.no,
              fontSize: 12,
              fontWeight: "700",
            }}
          >
            ✓ Resolved {prop.resolvedSide}
          </Text>
        </View>
      </View>
      {pos ? (
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "500" }}>
          You bet {pos.amount}⚡ on {pos.side} ·{" "}
          <Text
            style={{
              color: won ? colors.yes : colors.no,
              fontWeight: "700",
            }}
          >
            {won ? "won" : "lost"}
          </Text>
        </Text>
      ) : (
        <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: "500" }}>
          You didn't bet on this one.
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
    <View
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.lg,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: colors.text,
          letterSpacing: -0.2,
          lineHeight: 22,
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
                style={{ color: colors.yes, fontSize: 12, fontWeight: "700" }}
              >
                YES {asCents(yesProb)}
              </Text>
              <Text
                style={{ color: colors.no, fontSize: 12, fontWeight: "700" }}
              >
                NO {asCents(noProb)}
              </Text>
            </View>
            <ProbabilityBar yesProb={yesProb} />
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <YesNoButton
              side="YES"
              cents={asCents(yesProb)}
              active={pos?.side === "YES"}
              onPress={() => onTapWager(prop, "YES")}
            />
            <YesNoButton
              side="NO"
              cents={asCents(noProb)}
              active={pos?.side === "NO"}
              onPress={() => onTapWager(prop, "NO")}
            />
          </View>

          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ color: colors.textFaint, fontSize: 12, fontWeight: "500" }}
            >
              Volume {volume.toLocaleString()}⚡
            </Text>
            {pos ? (
              <Text
                style={{
                  color: pos.side === "YES" ? colors.yes : colors.no,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                You: {pos.amount}⚡ on {pos.side}
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
  );
}
