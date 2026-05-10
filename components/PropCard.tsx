import { Pressable, Text, View, Image, Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import {
  groupVoteOpen,
  MockProp,
  mockFriends,
  subjectAgreement,
} from "@/lib/mockData";
import { asCents, impliedYesProb, impliedNoProb } from "@/lib/odds";
import { useStore } from "@/lib/store";
import { CountdownChip } from "./CountdownChip";

type Props = {
  prop: MockProp;
  onTapWager: (prop: MockProp, side: "YES" | "NO") => void;
};

const PALETTE = ["#2563EB", "#DB2777", "#059669", "#EA580C", "#7C3AED", "#0891B2", "#CA8A04"];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function handleOf(userId: string): string {
  return mockFriends.find((f) => f.id === userId)?.handle ?? userId;
}

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
      <View style={{ position: "relative", marginRight: 4, marginBottom: 4 }}>
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
          <Text style={{ color: fg, fontSize: 13, fontWeight: "900", letterSpacing: 1.4 }}>
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
  const { castVote, votes, viewerId } = useStore();
  const myVote = votes[prop.id];

  const hasSubjects = prop.subjectUserIds.length > 0;
  const fallbackOpen = groupVoteOpen(prop);
  const verdicts = prop.subjectVerdicts ?? {};
  const subjectsVoted = prop.subjectUserIds.filter((id) => !!verdicts[id]).length;
  const viewerIsSubject = prop.subjectUserIds.includes(viewerId);

  /* Subjects still owe a verdict → no group vote yet. */
  if (hasSubjects && !fallbackOpen) {
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
            marginBottom: 10,
          }}
        >
          <Text style={{ color: colors.ink, fontSize: 10, fontWeight: "900", letterSpacing: 1.4 }}>
            WAITING ON SUBJECTS
          </Text>
        </View>
        <Text
          style={{
            color: colors.ink,
            fontSize: 14,
            fontWeight: "800",
            marginBottom: 6,
          }}
        >
          {subjectsVoted} OF {prop.subjectUserIds.length} WEIGHED IN
        </Text>
        <View style={{ gap: 4 }}>
          {prop.subjectUserIds.map((id) => {
            const v = verdicts[id];
            const handle = handleOf(id);
            return (
              <View key={id} style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: v ? colors.lime : colors.borderSoft,
                    borderColor: colors.ink,
                    borderWidth: 2,
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    color: colors.ink,
                    fontFamily: "Courier",
                    fontSize: 12,
                    fontWeight: "900",
                  }}
                >
                  {handle}
                </Text>
                <Text
                  style={{
                    marginLeft: 6,
                    color: v ? colors.ink : colors.textMuted,
                    fontFamily: "Courier",
                    fontSize: 11,
                    fontWeight: "700",
                    letterSpacing: 0.8,
                  }}
                >
                  · {v ? "IN" : "WAITING"}
                </Text>
              </View>
            );
          })}
        </View>
        {viewerIsSubject ? (
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: "Courier",
              fontSize: 11,
              fontWeight: "700",
              marginTop: 10,
              letterSpacing: 0.6,
            }}
          >
            CAST YOUR VERDICT FROM THE MIRROR.
          </Text>
        ) : (
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: "Courier",
              fontSize: 11,
              fontWeight: "700",
              marginTop: 10,
              letterSpacing: 0.6,
            }}
          >
            IF THEY DISAGREE, THE GROUP WILL DECIDE.
          </Text>
        )}
      </View>
    );
  }

  /* Group fallback open — either no subjects, or deadlock. */
  const deadlock = hasSubjects && subjectAgreement(prop) === "MIXED";

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
          backgroundColor: deadlock ? colors.blood : colors.warnBg,
          borderColor: colors.ink,
          borderWidth: border.thick,
          paddingHorizontal: 8,
          paddingVertical: 3,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: deadlock ? colors.chalk : colors.ink,
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.4,
          }}
        >
          {deadlock ? "DEADLOCK · GROUP DECIDES" : "AWAITING VERDICT"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        <Pressable onPress={() => cast("YES")} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: myVote?.side === "YES" ? colors.lime : colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.thick,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.ink, fontSize: 12, fontWeight: "900", letterSpacing: 1.2 }}>
              IT HAPPENED
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={() => cast("NO")} style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: myVote?.side === "NO" ? colors.blood : colors.chalk,
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
        <Ionicons name="camera" size={14} color={colors.ink} style={{ marginRight: 6 }} />
        <Text style={{ color: colors.ink, fontWeight: "900", fontSize: 12, letterSpacing: 1.2 }}>
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
        {totalCast} OF {prop.voterCount} VOTED, {prop.votes.yes} YES / {prop.votes.no} NO
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
          <Text style={{ color: won ? colors.yes : colors.no, fontWeight: "900" }}>
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

/* ─────────────────────── WMLT (AskUs) variant ─────────────────────── */

function FaceTile({
  userId,
  handle,
  isViewer,
  selected,
  onPress,
  disabled,
}: {
  userId: string;
  handle: string;
  isViewer: boolean;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={{ width: "33.333%", padding: 3 }}>
      <Pressable onPress={disabled ? undefined : onPress}>
        <View style={{ position: "relative", marginRight: 4, marginBottom: 4 }}>
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
              backgroundColor: selected ? colors.lime : colors.chalk,
              borderColor: colors.ink,
              borderWidth: border.thick,
              padding: 8,
              minHeight: 88,
              alignItems: "center",
              justifyContent: "center",
              opacity: disabled ? 0.85 : 1,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                backgroundColor: colorFor(userId),
                borderColor: colors.ink,
                borderWidth: 2,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 6,
              }}
            >
              <Text style={{ color: "#FFF", fontWeight: "900", fontSize: 16 }}>
                {handle.replace(/^@/, "")[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
            <Text
              numberOfLines={1}
              style={{
                color: colors.ink,
                fontWeight: "900",
                fontSize: 11,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              {isViewer ? "ME" : handle}
            </Text>
            {selected ? (
              <View
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: colors.ink,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  transform: [{ rotate: "-10deg" }],
                }}
              >
                <Text
                  style={{
                    color: colors.lime,
                    fontFamily: "Courier",
                    fontSize: 9,
                    fontWeight: "900",
                    letterSpacing: 1.2,
                  }}
                >
                  PICK
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

function WmltOpenBody({ prop }: { prop: MockProp }) {
  const { castWmltVote, viewerId } = useStore();
  const candidates = prop.candidateUserIds ?? [];
  const myPick = prop.wmltVotes?.[viewerId] ?? null;
  const lockedCount = Object.keys(prop.wmltVotes ?? {}).length;

  return (
    <View style={{ marginTop: 10 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -3 }}>
        {candidates.map((cid) => (
          <FaceTile
            key={cid}
            userId={cid}
            handle={handleOf(cid)}
            isViewer={cid === viewerId}
            selected={myPick === cid}
            onPress={() => castWmltVote(prop.id, cid)}
          />
        ))}
      </View>
      <View
        style={{
          marginTop: 6,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Courier",
            fontSize: 11,
            fontWeight: "900",
            letterSpacing: 1.2,
          }}
        >
          {lockedCount} / {prop.voterCount} LOCKED IN
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Courier",
            fontSize: 11,
            fontWeight: "700",
          }}
        >
          {myPick ? "YOUR PICK SAVED" : "PICK TO LOCK IN"}
        </Text>
      </View>
    </View>
  );
}

function WmltResolvedBody({ prop }: { prop: MockProp }) {
  const winners = prop.wmltWinnerIds ?? [];
  const tally: Record<string, number> = {};
  for (const t of Object.values(prop.wmltVotes ?? {})) {
    tally[t] = (tally[t] ?? 0) + 1;
  }
  const totalVotes = Object.keys(prop.wmltVotes ?? {}).length;
  return (
    <View style={{ marginTop: 12 }}>
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: colors.lime,
          borderColor: colors.ink,
          borderWidth: border.thick,
          paddingHorizontal: 8,
          paddingVertical: 3,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: colors.ink, fontSize: 10, fontWeight: "900", letterSpacing: 1.4 }}>
          PLURALITY {winners.length > 1 ? "TIE" : "WINNER"}
        </Text>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {winners.length === 0 ? (
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: "Courier",
              fontSize: 12,
              fontWeight: "700",
            }}
          >
            NOBODY VOTED ON THIS ONE.
          </Text>
        ) : (
          winners.map((wid) => (
            <View
              key={wid}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.ink,
                paddingHorizontal: 10,
                paddingVertical: 6,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  backgroundColor: colorFor(wid),
                  marginRight: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "900", fontSize: 11 }}>
                  {handleOf(wid).replace(/^@/, "")[0]?.toUpperCase() ?? "?"}
                </Text>
              </View>
              <Text
                style={{
                  color: colors.lime,
                  fontWeight: "900",
                  fontSize: 14,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                }}
              >
                {handleOf(wid)}
              </Text>
              <Text
                style={{
                  marginLeft: 8,
                  color: colors.chalk,
                  fontFamily: "Courier",
                  fontWeight: "900",
                  fontSize: 12,
                }}
              >
                {tally[wid] ?? 0}V
              </Text>
            </View>
          ))
        )}
      </View>
      <Text
        style={{
          marginTop: 10,
          color: colors.textMuted,
          fontFamily: "Courier",
          fontSize: 11,
          fontWeight: "900",
          letterSpacing: 1.2,
        }}
      >
        {totalVotes} TOTAL VOTES · WHO VOTED FOR WHOM IS REVEALED IN THE MIRROR
      </Text>
    </View>
  );
}

/* ─────────────────────────── Card shell ─────────────────────────── */

export function PropCard({ prop, onTapWager }: Props) {
  const { positions } = useStore();
  const pos = positions[prop.id];
  const isWmlt = prop.kind === "WMLT";
  const yesProb = !isWmlt ? impliedYesProb(prop) : 0.5;
  const noProb = !isWmlt ? impliedNoProb(prop) : 0.5;
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
        {/* Top chip row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: isWmlt ? colors.violet : colors.ink,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Ionicons
              name={isWmlt ? "people" : "trending-up"}
              size={11}
              color={isWmlt ? colors.ink : colors.lime}
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                color: isWmlt ? colors.ink : colors.lime,
                fontFamily: "Courier",
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 1.2,
              }}
            >
              {isWmlt ? "ASKUS · WMLT" : "YES / NO BET"}
            </Text>
            {prop.fromHouse ? (
              <Text
                style={{
                  marginLeft: 6,
                  color: isWmlt ? colors.ink : colors.lime,
                  fontFamily: "Courier",
                  fontSize: 9,
                  fontWeight: "900",
                  letterSpacing: 1,
                  opacity: 0.75,
                }}
              >
                · FROM THE HOUSE
              </Text>
            ) : null}
          </View>
          <CountdownChip expiresAt={prop.expiresAt} />
        </View>

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

        {/* Body switches on kind + status */}
        {isWmlt ? (
          prop.status === "RESOLVED" ? (
            <WmltResolvedBody prop={prop} />
          ) : (
            <WmltOpenBody prop={prop} />
          )
        ) : prop.status === "OPEN" ? (
          <>
            <View style={{ marginTop: 14, marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: colors.yes, fontSize: 11, fontWeight: "900", letterSpacing: 1.2 }}>
                  YES {asCents(yesProb)}
                </Text>
                <Text style={{ color: colors.no, fontSize: 11, fontWeight: "900", letterSpacing: 1.2 }}>
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
