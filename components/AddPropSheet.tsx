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

export function AddPropSheet({ visible, onClose, eventId, eventMembers }: Props) {
  const { addProp } = useStore();
  const [text, setText] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setText("");
      setSubjects([]);
    }
  }, [visible]);

  const submit = () => {
    const result = addProp(eventId, text, subjects);
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
                  marginBottom: 4,
                }}
              >
                ADD PROP
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "900",
                  color: colors.ink,
                  letterSpacing: -0.4,
                  marginBottom: 16,
                  textTransform: "uppercase",
                }}
              >
                What might happen?
              </Text>

              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Dave hits a triple twenty in the first leg"
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
                  marginBottom: 18,
                  backgroundColor: colors.bone,
                }}
              />

              <SubjectTagger
                friends={eventMembers}
                selected={subjects}
                onChange={setSubjects}
              />

              <View style={{ height: 18 }} />

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
                  ADD TO EVENT
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
