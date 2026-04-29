import { Modal, Pressable, Text, View, Alert, Platform } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  eventTitle: string;
  inviteCode: string;
};

export function InviteSheet({ visible, onClose, eventTitle, inviteCode }: Props) {
  const [copied, setCopied] = useState(false);
  const link = `betonyourfriends.app/join/${inviteCode}`;

  const copy = async () => {
    const text = `Join "${eventTitle}" on BetOnYourFriends — ${link}`;
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined") {
        await navigator.clipboard.writeText(text);
      } else {
        // expo-clipboard would land in a future commit; for now no-op on native.
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      if (Platform.OS !== "web") {
        Alert.alert("Couldn't copy", "Try writing the code down for now.");
      }
    }
  };

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
              Invite friends
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: colors.text,
                letterSpacing: -0.3,
                marginBottom: 18,
              }}
            >
              {eventTitle}
            </Text>

            <View
              style={{
                backgroundColor: colors.bgInset,
                borderRadius: radius.md,
                padding: 18,
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "700",
                  color: colors.textMuted,
                  letterSpacing: 1.4,
                  marginBottom: 8,
                }}
              >
                EVENT CODE
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: colors.text,
                  letterSpacing: 4,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {inviteCode}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.bgInset,
                borderRadius: radius.md,
                paddingVertical: 14,
                paddingHorizontal: 14,
                marginBottom: 18,
              }}
            >
              <Ionicons name="link-outline" size={16} color={colors.textMuted} />
              <Text
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 14,
                  color: colors.textMuted,
                  fontWeight: "500",
                }}
                numberOfLines={1}
              >
                {link}
              </Text>
            </View>

            <Pressable
              onPress={copy}
              style={({ pressed }) => ({
                backgroundColor: copied ? colors.yes : colors.text,
                borderRadius: radius.md,
                paddingVertical: 14,
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
                flexDirection: "row",
                justifyContent: "center",
              })}
            >
              <Ionicons
                name={copied ? "checkmark" : "copy-outline"}
                size={16}
                color="#FFFFFF"
              />
              <Text
                style={{
                  marginLeft: 8,
                  color: "#FFFFFF",
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                {copied ? "Copied" : "Copy invite link"}
              </Text>
            </Pressable>

            <Text
              style={{
                marginTop: 12,
                fontSize: 12,
                color: colors.textMuted,
                textAlign: "center",
              }}
            >
              Friends with the code can join, add their own props, and bet.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
