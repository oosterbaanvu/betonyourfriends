import { Pressable, Text, View } from "react-native";
import { colors, border } from "@/theme/tokens";
import { Friend } from "@/lib/mockData";

type Props = {
  friends: Friend[];
  selected: string[];
  onChange: (next: string[]) => void;
};

/**
 * Brutalist multi-select chips: pick which friends a prop is *about*.
 * Subjects can never see/wager on/vote on their own props.
 */
export function SubjectTagger({ friends, selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "900",
          color: colors.textMuted,
          letterSpacing: 1.4,
          marginBottom: 8,
        }}
      >
        ABOUT WHOM?
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {friends.map((f) => {
          const isOn = selected.includes(f.id);
          return (
            <Pressable
              key={f.id}
              onPress={() => toggle(f.id)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderColor: colors.ink,
                borderWidth: border.thick,
                backgroundColor: isOn ? colors.ink : colors.chalk,
                marginRight: 6,
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: isOn ? colors.chalk : colors.ink,
                  fontSize: 12,
                  fontWeight: "900",
                  letterSpacing: 0.5,
                }}
              >
                {f.handle}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text
        style={{
          marginTop: 6,
          fontSize: 10,
          color: colors.textMuted,
          fontFamily: "Courier",
          fontWeight: "900",
          letterSpacing: 0.8,
        }}
      >
        TAGGED FRIENDS WON'T SEE THIS PROP.
      </Text>
    </View>
  );
}
