import { View, ViewProps } from "react-native";
import { colors, border } from "@/theme/tokens";

type Props = ViewProps & {
  bg?: keyof typeof colors;
  offset?: number;
};

/**
 * Card with thick black border + hard offset block behind it (brutalist drop).
 * No soft shadow — uses a stacked black rectangle for the drop effect.
 */
export function BrutalCard({
  bg = "chalk",
  offset = 6,
  style,
  children,
  ...rest
}: Props) {
  return (
    <View style={{ position: "relative", marginRight: offset, marginBottom: offset }}>
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
      <View
        {...rest}
        style={[
          {
            backgroundColor: colors[bg],
            borderColor: colors.ink,
            borderWidth: border.brutal,
            padding: 16,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
