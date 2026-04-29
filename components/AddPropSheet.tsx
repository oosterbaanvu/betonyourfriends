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
import { colors, radius } from "@/theme/tokens";
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
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: colors.textMuted,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Add prop
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: colors.text,
                  letterSpacing: -0.3,
                  marginBottom: 16,
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
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 16,
                  fontWeight: "500",
                  color: colors.text,
                  minHeight: 70,
                  textAlignVertical: "top",
                  marginBottom: 18,
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
                style={({ pressed }) => ({
                  backgroundColor: canSubmit ? colors.text : colors.borderStrong,
                  borderRadius: radius.md,
                  paddingVertical: 14,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text
                  style={{
                    marginLeft: 4,
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: 15,
                  }}
                >
                  Add to event
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
