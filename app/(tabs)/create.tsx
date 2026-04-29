import { View, Text, TextInput, Pressable } from "react-native";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScreenFrame } from "@/components/ScreenFrame";
import { BrutalCard } from "@/components/BrutalCard";
import { BrutalButton } from "@/components/BrutalButton";
import { PackPicker } from "@/components/PackPicker";
import { SubjectTagger } from "@/components/SubjectTagger";
import { colors, radius } from "@/theme/tokens";
import { mockFriends } from "@/lib/mockData";

type DraftProp = {
  description: string;
  subjectIds: string[];
  fromPack?: string;
};

const PLACEHOLDERS = [
  "Friday night darts at The Anchor",
  "Lakers vs Celtics",
  "Sarah finishes her thesis",
  "Saturday bar crawl",
  "Tom's birthday",
  "Kitchen Renovation Race",
];

const inputStyle = {
  borderColor: colors.border,
  borderWidth: 1,
  backgroundColor: colors.bg,
  borderRadius: radius.md,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 15,
  fontWeight: "500" as const,
  color: colors.text,
};

const labelStyle = {
  fontSize: 12,
  fontWeight: "700" as const,
  color: colors.textMuted,
  letterSpacing: 0.6,
  marginBottom: 6,
  textTransform: "uppercase" as const,
};

function SectionHeader({
  title,
  hint,
  count,
}: {
  title: string;
  hint?: string;
  count?: number;
}) {
  return (
    <View style={{ marginBottom: 10, marginTop: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "800",
            color: colors.text,
            letterSpacing: -0.2,
          }}
        >
          {title}
        </Text>
        {typeof count === "number" ? (
          <View
            style={{
              marginLeft: 8,
              backgroundColor: colors.bgInset,
              paddingHorizontal: 7,
              paddingVertical: 1,
              borderRadius: radius.pill,
            }}
          >
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: "700",
              }}
            >
              {count}
            </Text>
          </View>
        ) : null}
      </View>
      {hint ? (
        <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export default function CreateScreen() {
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [props, setProps] = useState<DraftProp[]>([
    { description: "", subjectIds: [] },
  ]);

  const placeholder = useMemo(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)],
    []
  );

  const addProp = () =>
    setProps((p) => [...p, { description: "", subjectIds: [] }]);
  const removeProp = (i: number) =>
    setProps((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : p));
  const updateText = (i: number, v: string) =>
    setProps((p) =>
      p.map((x, idx) => (idx === i ? { ...x, description: v } : x))
    );
  const updateSubjects = (i: number, ids: string[]) =>
    setProps((p) =>
      p.map((x, idx) => (idx === i ? { ...x, subjectIds: ids } : x))
    );

  const applyPack = (newProps: string[], packName: string) => {
    const drafts: DraftProp[] = newProps.map((d) => ({
      description: d,
      subjectIds: [],
      fromPack: packName,
    }));
    setProps((p) => {
      if (
        p.length === 1 &&
        p[0].description.trim() === "" &&
        p[0].subjectIds.length === 0
      ) {
        return drafts;
      }
      return [...p, ...drafts];
    });
  };

  const validCount = props.filter((p) => p.description.trim().length > 0).length;
  const canLaunch = title.trim().length > 0 && validCount > 0;

  return (
    <ScreenFrame title="New event">
      <SectionHeader
        title="What's the event?"
        hint="Anything goes. A darts night, the playoffs, your friend's deadline. If your friends will be there, you can wager on it."
      />
      <BrutalCard>
        <Text style={labelStyle}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          style={inputStyle}
        />

        <Text style={[labelStyle, { marginTop: 14 }]}>Starts at</Text>
        <TextInput
          value={startsAt}
          onChangeText={setStartsAt}
          placeholder="Tonight, 9:00 PM"
          placeholderTextColor={colors.textFaint}
          style={inputStyle}
        />
      </BrutalCard>

      <SectionHeader
        title="Need inspiration?"
        hint="Tap a pack to load ready-made bets in one shot."
      />
      <View style={{ marginHorizontal: -16 }}>
        <View style={{ paddingLeft: 16 }}>
          <PackPicker onApply={applyPack} />
        </View>
      </View>

      <View style={{ height: 8 }} />

      <SectionHeader
        title="Predictions"
        hint="One question per card. You can keep adding props after the event launches too."
        count={props.length}
      />

      {props.map((p, i) => (
        <BrutalCard key={i}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={labelStyle}>Prop {i + 1}</Text>
              {p.fromPack ? (
                <View
                  style={{
                    marginLeft: 8,
                    marginBottom: 4,
                    backgroundColor: colors.primaryFaint,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: radius.pill,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 10,
                      fontWeight: "700",
                    }}
                  >
                    {p.fromPack}
                  </Text>
                </View>
              ) : null}
            </View>
            {props.length > 1 ? (
              <Pressable
                onPress={() => removeProp(i)}
                hitSlop={8}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons name="close" size={14} color={colors.no} />
                <Text
                  style={{
                    marginLeft: 2,
                    color: colors.no,
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  Remove
                </Text>
              </Pressable>
            ) : null}
          </View>
          <TextInput
            value={p.description}
            onChangeText={(v) => updateText(i, v)}
            placeholder='e.g. "Dave hits a 180 in the first leg"'
            placeholderTextColor={colors.textFaint}
            multiline
            style={[inputStyle, { minHeight: 56, textAlignVertical: "top" }]}
          />

          <View style={{ height: 14 }} />

          <SubjectTagger
            friends={mockFriends}
            selected={p.subjectIds}
            onChange={(ids) => updateSubjects(i, ids)}
          />
        </BrutalCard>
      ))}

      <BrutalButton
        label="Add another prop"
        onPress={addProp}
        variant="secondary"
        fullWidth
      />

      <View style={{ height: 12 }} />

      <BrutalButton
        label={
          canLaunch
            ? `Launch event with ${validCount} prop${validCount === 1 ? "" : "s"}`
            : "Add a title and one prop to launch"
        }
        onPress={canLaunch ? () => {} : undefined}
        variant="primary"
        fullWidth
        size="lg"
      />

      <View style={{ height: 24 }} />
    </ScreenFrame>
  );
}
