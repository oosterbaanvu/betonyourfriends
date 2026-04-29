import { View, ViewProps } from "react-native";
import { colors, radius, shadow } from "@/theme/tokens";

type Props = ViewProps & {
  padding?: number;
  flat?: boolean;
};

/**
 * Plain card surface — white, 1px border, soft drop, modest radius.
 * (Filename retained for now; behavior is the clean variant.)
 */
export function BrutalCard({
  padding = 16,
  flat = false,
  style,
  children,
  ...rest
}: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.bg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding,
          marginBottom: 12,
        },
        !flat && shadow.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}
