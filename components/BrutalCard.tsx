import { View, ViewProps } from "react-native";
import { colors, border, radius } from "@/theme/tokens";

type Props = ViewProps & {
  bg?: keyof typeof colors;
  /** stacked-block drop offset; 0 disables it */
  offset?: number;
  /** thinner card variant for dense lists */
  flat?: boolean;
  padding?: number;
};

/**
 * Brutalist card: hard 5px border + stacked-block drop. Never soft.
 */
export function BrutalCard({
  bg = "chalk",
  offset = 5,
  flat = false,
  padding = 16,
  style,
  children,
  ...rest
}: Props) {
  if (flat || offset === 0) {
    return (
      <View
        {...rest}
        style={[
          {
            backgroundColor: colors[bg],
            borderColor: colors.ink,
            borderWidth: flat ? border.thick : border.brutal,
            borderRadius: radius.none,
            padding,
            marginBottom: 12,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }
  return (
    <View
      style={{
        position: "relative",
        marginRight: offset,
        marginBottom: offset + 8,
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
      <View
        {...rest}
        style={[
          {
            backgroundColor: colors[bg],
            borderColor: colors.ink,
            borderWidth: border.brutal,
            borderRadius: radius.none,
            padding,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
