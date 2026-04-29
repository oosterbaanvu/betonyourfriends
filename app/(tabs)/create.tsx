import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
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
  fontWeight: "600" as const,
  color: colors.textMuted,
  marginBottom: 6,
};

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={{ marginBottom: 10, marginTop: 6 }}>
      <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text }}>
        {title}
      </Text>
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
      // Drop the leading empty draft if it's still untouched.
      if (p.length === 1 && p[0].description.trim() === "" && p[0].subjectIds.length === 0) {
        return drafts;
      }
      return [...p, ...drafts];
    });
  };

  const totalProps = props.length;
  const validCount = props.filter((p) => p.description.trim().length > 0).length;
  const canLaunch = title.trim().length > 0 && validCount > 0;

  return (
    <ScreenFrame title="New Market">
      <SectionHeader
        title="Event details"
        hint="The thing that's going to happen. Or maybe not."
      />
      <BrutalCard>
        <Text style={labelStyle}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Saturday bar crawl"
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
        title={`Predictions${totalProps ? `  ·  ${totalProps}` : ""}`}
        hint='One question per card, e.g. "Mark spills his drink"'
      />

      {props.map((p, i) => (
        <BrutalCard key={i}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
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
              <Pressable onPress={() => removeProp(i)}>
                <Text
                  style={{ color: colors.no, fontSize: 13, fontWeight: "600" }}
                >
                  Remove
                </Text>
              </Pressable>
            ) : null}
          </View>
          <TextInput
            value={p.description}
            onChangeText={(v) => updateText(i, v)}
            placeholder='e.g. "Mark spills his drink"'
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
        label="+ Add another prop"
        onPress={addProp}
        variant="secondary"
        fullWidth
      />

      <View style={{ height: 12 }} />

      <BrutalButton
        label={canLaunch ? `Launch market · ${validCount} props` : "Add a title and one prop to launch"}
        onPress={canLaunch ? () => {} : undefined}
        variant="primary"
        fullWidth
        size="lg"
      />

      <View style={{ height: 24 }} />
    </ScreenFrame>
  );
}
