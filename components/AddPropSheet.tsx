import {
  Modal,
  Pressable,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";
import { Friend } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { SubjectTagger } from "./SubjectTagger";

type Props = {
  visible: boolean;
  onClose: () => void;
  eventId: string;
  eventMembers: Friend[];
};

type Kind = "YESNO" | "WMLT";

const DURATIONS: { label: string; minutes: number }[] = [
  { label: "20 MIN", minutes: 20 },
  { label: "1 HOUR", minutes: 60 },
  { label: "4 HOURS", minutes: 60 * 4 },
  { label: "ALL NIGHT", minutes: 60 * 12 },
];

export function AddPropSheet({ visible, onClose, eventId, eventMembers }: Props) {
  const { addProp, addWmltProp } = useStore();
  const [kind, setKind] = useState<Kind>("YESNO");
  const [text, setText] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [durationMinutes, setDurationMinutes] = useState<number>(60 * 4);

  useEffect(() => {
    if (visible) {
      setKind("YESNO");
      setText("");
      setSubjects([]);
      setDurationMinutes(60 * 4);
    }
  }, [visible]);

  const submit = () => {
    const result =
      kind === "YESNO"
        ? addProp(eventId, text, subjects, { expiresInMinutes: durationMinutes })
        : addWmltProp(
            eventId,
            text,
            eventMembers.map((m) => m.id),
            { expiresInMinutes: durationMinutes }
          );
    if (!result.ok) {
      if (Platform.OS !== "web") Alert.alert("Couldn't add prop", result.reason);
      else if (typeof window !== "undefined") window.alert(result.reason);
      return;
    }
    onClose();
  };

  const canSubmit = text.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(10, 10, 10, 0.55)",
          justifyContent: "flex-end",
        }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable onPress={() => {}}>
            <View
              style={{
                backgroundColor: colors.chalk,
                borderTopColor: colors.ink,
                borderTopWidth: border.brutal,
                padding: 20,
                paddingBottom: 28,
                maxHeight: "92%",
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  width: 44,
                  height: 5,
                  backgroundColor: colors.ink,
                  marginBottom: 14,
                }}
              />

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "900",
                    color: colors.textMuted,
                    letterSpacing: 1.6,
                    fontFamily: "Courier",
                    marginBottom: 4,
                  }}
                >
                  NEW BET
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "900",
                    color: colors.ink,
                    letterSpacing: -0.4,
                    marginBottom: 14,
                    textTransform: "uppercase",
                  }}
                >
                  {kind === "YESNO" ? "What might happen?" : "Who is most likely to..."}
                </Text>

                {/* Kind switcher */}
                <View
                  style={{
                    flexDirection: "row",
                    borderColor: colors.ink,
                    borderWidth: border.thick,
                    marginBottom: 16,
                  }}
                >
                  <Pressable
                    onPress={() => setKind("YESNO")}
                    style={{
                      flex: 1,
                      backgroundColor: kind === "YESNO" ? colors.ink : colors.chalk,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: kind === "YESNO" ? colors.lime : colors.ink,
                        fontWeight: "900",
                        fontSize: 11,
                        letterSpacing: 1.4,
                        textAlign: "center",
                      }}
                    >
                      YES / NO BET
                    </Text>
                    <Text
                      style={{
                        color: kind === "YESNO" ? "#A1A1A1" : colors.textMuted,
                        fontFamily: "Courier",
                        fontSize: 10,
                        fontWeight: "700",
                        textAlign: "center",
                        marginTop: 2,
                      }}
                    >
                      WAGER WITH TOKENS
                    </Text>
                  </Pressable>
                  <View style={{ width: border.thick, backgroundColor: colors.ink }} />
                  <Pressable
                    onPress={() => setKind("WMLT")}
                    style={{
                      flex: 1,
                      backgroundColor: kind === "WMLT" ? colors.ink : colors.chalk,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: kind === "WMLT" ? colors.lime : colors.ink,
                        fontWeight: "900",
                        fontSize: 11,
                        letterSpacing: 1.4,
                        textAlign: "center",
                      }}
                    >
                      ASKUS · WMLT
                    </Text>
                    <Text
                      style={{
                        color: kind === "WMLT" ? "#A1A1A1" : colors.textMuted,
                        fontFamily: "Courier",
                        fontSize: 10,
                        fontWeight: "700",
                        textAlign: "center",
                        marginTop: 2,
                      }}
                    >
                      VOTE ON A FRIEND
                    </Text>
                  </Pressable>
                </View>

                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder={
                    kind === "YESNO"
                      ? "Julian beats Floris in a leg of darts"
                      : "Who's most likely to argue about the scoring math?"
                  }
                  placeholderTextColor={colors.textFaint}
                  multiline
                  style={{
                    borderColor: colors.ink,
                    borderWidth: border.thick,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 16,
                    fontWeight: "700",
                    color: colors.ink,
                    minHeight: 70,
                    textAlignVertical: "top",
                    marginBottom: 14,
                    backgroundColor: colors.bone,
                  }}
                />

                {/* Duration picker */}
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: "Courier",
                    fontSize: 10,
                    fontWeight: "900",
                    letterSpacing: 1.4,
                    marginBottom: 6,
                  }}
                >
                  LOCKS IN
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {DURATIONS.map((d) => {
                    const active = durationMinutes === d.minutes;
                    return (
                      <Pressable
                        key={d.minutes}
                        onPress={() => setDurationMinutes(d.minutes)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          backgroundColor: active ? colors.ink : colors.chalk,
                          borderColor: colors.ink,
                          borderWidth: border.thick,
                        }}
                      >
                        <Text
                          style={{
                            color: active ? colors.lime : colors.ink,
                            fontWeight: "900",
                            fontSize: 11,
                            letterSpacing: 1.2,
                          }}
                        >
                          {d.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {/* Subjects only for YESNO */}
                {kind === "YESNO" ? (
                  <>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontFamily: "Courier",
                        fontSize: 10,
                        fontWeight: "900",
                        letterSpacing: 1.4,
                        marginBottom: 6,
                      }}
                    >
                      WHO'S THIS ABOUT? (THEY WON'T SEE IT)
                    </Text>
                    <SubjectTagger
                      friends={eventMembers}
                      selected={subjects}
                      onChange={setSubjects}
                    />
                  </>
                ) : (
                  <View
                    style={{
                      backgroundColor: colors.bone,
                      borderColor: colors.ink,
                      borderWidth: border.thick,
                      padding: 12,
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.ink,
                        fontFamily: "Courier",
                        fontSize: 11,
                        fontWeight: "900",
                        letterSpacing: 1.2,
                      }}
                    >
                      EVERY MEMBER IS A CANDIDATE
                    </Text>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontFamily: "Courier",
                        fontSize: 10,
                        fontWeight: "700",
                        marginTop: 4,
                      }}
                    >
                      VOTES HIDDEN UNTIL TIMER ENDS. WINNER REVEALED IN THE MIRROR.
                    </Text>
                  </View>
                )}

                <View style={{ height: 16 }} />

                <Pressable
                  onPress={canSubmit ? submit : undefined}
                  style={{
                    backgroundColor: canSubmit ? colors.lime : colors.borderSoft,
                    borderColor: colors.ink,
                    borderWidth: border.brutal,
                    paddingVertical: 14,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="add" size={18} color={colors.ink} />
                  <Text
                    style={{
                      marginLeft: 4,
                      color: colors.ink,
                      fontWeight: "900",
                      fontSize: 14,
                      letterSpacing: 1.4,
                    }}
                  >
                    {kind === "YESNO" ? "POST BET" : "POST ASKUS"}
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
