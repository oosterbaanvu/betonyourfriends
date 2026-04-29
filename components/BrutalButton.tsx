import { Pressable, Text, View, GestureResponderEvent } from "react-native";
import { useState } from "react";
import { colors, border } from "@/theme/tokens";

type Props = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  bg?: keyof typeof colors;
  fg?: keyof typeof colors;
  offset?: number;
  fullWidth?: boolean;
};

/**
 * Stomp-button: tap = visually compresses against its black drop-block.
 * No soft shadow, no border radius.
 */
export function BrutalButton({
  label,
  onPress,
  bg = "lime",
  fg = "ink",
  offset = 5,
  fullWidth,
}: Props) {
  const [pressed, setPressed] = useState(false);
  const shift = pressed ? offset : 0;

  return (
    <View
      style={{
        position: "relative",
        marginRight: offset,
        marginBottom: offset,
        alignSelf: fullWidth ? "stretch" : "flex-start",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: offset,
          left: offset,
          right: -offset,
          bottom: -offset,
          backgroundColor: colors.ink,
        }}
      />
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={{
          backgroundColor: colors[bg],
          borderColor: colors.ink,
          borderWidth: border.brutal,
          paddingVertical: 14,
          paddingHorizontal: 20,
          transform: [{ translateX: shift }, { translateY: shift }],
        }}
      >
        <Text
          style={{
            color: colors[fg],
            fontWeight: "900",
            fontSize: 18,
            letterSpacing: 0.5,
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
