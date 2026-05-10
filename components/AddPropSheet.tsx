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
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    if (visible) {
      setKind("YESNO");
      setText("");
      setSubjects([]);
      setDurationMinutes(60);
      setAdvanced(false);
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
      if (Platform.OS !== "web") Alert.alert("Couldn't post bet", result.reason);
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
                padding: 18,
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
                  }}
                >
                  QUICK BET
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "900",
                    color: colors.ink,
                    letterSpacing: -0.6,
                    marginTop: 2,
                    marginBottom: 12,
                    textTransform: "uppercase",
                  }}
                >
                  What's the bet?
                </Text>

                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder={
                    kind === "YESNO"
                      ? "Dave chugs a beer in under 30 seconds"
                      : "Who's most likely to embarrass themselves first?"
                  }
                  placeholderTextColor={colors.textFaint}
                  multiline
                  autoFocus
                  style={{
                    borderColor: colors.ink,
                    borderWidth: border.thick,
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    fontSize: 17,
                    fontWeight: "800",
                    color: colors.ink,
                    minHeight: 80,
                    textAlignVertical: "top",
                    backgroundColor: colors.bone,
                  }}
                />

                {/* Advanced toggle */}
                <Pressable
                  onPress={() => setAdvanced((a) => !a)}
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={advanced ? "chevron-down" : "chevron-forward"}
                    size={14}
                    color={colors.textMuted}
                  />
                  <Text
                    style={{
                      marginLeft: 4,
                      color: colors.textMuted,
                      fontFamily: "Courier",
                      fontSize: 11,
                      fontWeight: "900",
                      letterSpacing: 1.4,
                    }}
                  >
                    {advanced ? "HIDE OPTIONS" : "OPTIONS · KIND · TIMER · SUBJECTS"}
                  </Text>
                </Pressable>

                {advanced ? (
                  <View style={{ marginTop: 12 }}>
                    {/* Kind switcher */}
                    <View
                      style={{
                        flexDirection: "row",
                        borderColor: colors.ink,
                        borderWidth: border.thick,
                        marginBottom: 14,
                      }}
                    >
                      <Pressable
                        onPress={() => setKind("YESNO")}
                        style={{
                          flex: 1,
                          backgroundColor: kind === "YESNO" ? colors.ink : colors.chalk,
                          paddingVertical: 8,
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
                      </Pressable>
                      <View style={{ width: border.thick, backgroundColor: colors.ink }} />
                      <Pressable
                        onPress={() => setKind("WMLT")}
                        style={{
                          flex: 1,
                          backgroundColor: kind === "WMLT" ? colors.ink : colors.chalk,
                          paddingVertical: 8,
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
                      </Pressable>
                    </View>

                    {/* Duration */}
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
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {DURATIONS.map((d) => {
                        const active = durationMinutes === d.minutes;
                        return (
                          <Pressable
                            key={d.minutes}
                            onPress={() => setDurationMinutes(d.minutes)}
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 7,
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
                          ABOUT WHO? (OPTIONAL · THEY WON'T SEE IT)
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
                          padding: 10,
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
                          EVERY PLAYER IS A CANDIDATE
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
                          VOTES STAY HIDDEN UNTIL THE TIMER ENDS.
                        </Text>
                      </View>
                    )}
                  </View>
                ) : null}

                <View style={{ height: 16 }} />

                <Pressable onPress={canSubmit ? submit : undefined}>
                  <View style={{ position: "relative", marginRight: 5 }}>
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
                        paddingVertical: 16,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="flash" size={16} color={colors.ink} />
                      <Text
                        style={{
                          marginLeft: 6,
                          color: colors.ink,
                          fontWeight: "900",
                          fontSize: 15,
                          letterSpacing: 1.4,
                        }}
                      >
                        POST BET
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
