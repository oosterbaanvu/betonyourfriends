import { Modal, Pressable, Text, View, Alert, Platform } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors, border } from "@/theme/tokens";

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
          backgroundColor: "rgba(10, 10, 10, 0.55)",
          justifyContent: "flex-end",
        }}
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
              INVITE FRIENDS
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "900",
                color: colors.ink,
                letterSpacing: -0.4,
                marginBottom: 18,
                textTransform: "uppercase",
              }}
            >
              {eventTitle}
            </Text>

            <View
              style={{
                backgroundColor: colors.lime,
                borderColor: colors.ink,
                borderWidth: border.brutal,
                padding: 18,
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "900",
                  color: colors.ink,
                  letterSpacing: 1.6,
                  marginBottom: 6,
                }}
              >
                EVENT CODE
              </Text>
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "900",
                  color: colors.ink,
                  letterSpacing: 4,
                  fontFamily: "Courier",
                }}
              >
                {inviteCode}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.bone,
                borderColor: colors.ink,
                borderWidth: border.thick,
                paddingVertical: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
              }}
            >
              <Ionicons name="link" size={14} color={colors.ink} />
              <Text
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 12,
                  color: colors.ink,
                  fontWeight: "900",
                  fontFamily: "Courier",
                }}
                numberOfLines={1}
              >
                {link}
              </Text>
            </View>

            <Pressable
              onPress={copy}
              style={{
                backgroundColor: copied ? colors.lime : colors.ink,
                borderColor: colors.ink,
                borderWidth: border.brutal,
                paddingVertical: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={copied ? "checkmark" : "copy"}
                size={16}
                color={copied ? colors.ink : colors.chalk}
              />
              <Text
                style={{
                  marginLeft: 8,
                  color: copied ? colors.ink : colors.chalk,
                  fontWeight: "900",
                  fontSize: 14,
                  letterSpacing: 1.4,
                }}
              >
                {copied ? "COPIED" : "COPY INVITE LINK"}
              </Text>
            </Pressable>

            <Text
              style={{
                marginTop: 12,
                fontSize: 11,
                color: colors.textMuted,
                textAlign: "center",
                fontWeight: "900",
                fontFamily: "Courier",
              }}
            >
              FRIENDS WITH THE CODE CAN JOIN, ADD PROPS, AND BET.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
