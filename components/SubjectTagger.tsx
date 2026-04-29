import { Pressable, Text, View } from "react-native";
import { colors, radius } from "@/theme/tokens";
import { Friend } from "@/lib/mockData";

type Props = {
  friends: Friend[];
  selected: string[];
  onChange: (next: string[]) => void;
};

/**
 * Multi-select chip row: pick which friends a prop is *about*.
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
          fontSize: 12,
          fontWeight: "600",
          color: colors.textMuted,
          marginBottom: 8,
        }}
      >
        About whom?
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
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: isOn ? colors.text : colors.border,
                backgroundColor: isOn ? colors.text : colors.bg,
                marginRight: 6,
                marginBottom: 6,
              }}
            >
              <Text
                style={{
                  color: isOn ? "#FFFFFF" : colors.text,
                  fontSize: 13,
                  fontWeight: "600",
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
          marginTop: 4,
          fontSize: 11,
          color: colors.textFaint,
        }}
      >
        Tagged friends won't see this prop in their feed.
      </Text>
    </View>
  );
}
