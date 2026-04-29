import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { ScreenFrame } from "@/components/ScreenFrame";
import { BrutalCard } from "@/components/BrutalCard";
import { BrutalButton } from "@/components/BrutalButton";
import { colors, radius } from "@/theme/tokens";

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
    <View style={{ marginBottom: 8, marginTop: 4 }}>
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
  const [props, setProps] = useState<string[]>([""]);

  const addProp = () => setProps((p) => [...p, ""]);
  const removeProp = (i: number) =>
    setProps((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : p));
  const updateProp = (i: number, v: string) =>
    setProps((p) => p.map((x, idx) => (idx === i ? v : x)));

  return (
    <ScreenFrame title="New Market">
      <SectionHeader
        title="Event details"
        hint="The thing that's going to happen — or maybe not."
      />
      <BrutalCard>
        <Text style={labelStyle}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Mark's Birthday Rager"
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
        title="Predictions"
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
            <Text style={labelStyle}>Prop {i + 1}</Text>
            {props.length > 1 ? (
              <Pressable onPress={() => removeProp(i)}>
                <Text style={{ color: colors.no, fontSize: 13, fontWeight: "600" }}>
                  Remove
                </Text>
              </Pressable>
            ) : null}
          </View>
          <TextInput
            value={p}
            onChangeText={(v) => updateProp(i, v)}
            placeholder='e.g. "Mark spills his drink"'
            placeholderTextColor={colors.textFaint}
            multiline
            style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
          />
          <Text
            style={{
              marginTop: 8,
              fontSize: 12,
              color: colors.textMuted,
            }}
          >
            Subjects can't see or wager on their own props.
          </Text>
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
        label="Launch market"
        onPress={() => {}}
        variant="primary"
        fullWidth
        size="lg"
      />
    </ScreenFrame>
  );
}
