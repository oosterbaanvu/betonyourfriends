import { View, Text, TextInput } from "react-native";
import { useState } from "react";
import { ScreenFrame } from "@/components/ScreenFrame";
import { BrutalCard } from "@/components/BrutalCard";
import { BrutalButton } from "@/components/BrutalButton";
import { colors, border } from "@/theme/tokens";

const inputStyle = {
  borderColor: colors.ink,
  borderWidth: border.thick,
  backgroundColor: colors.chalk,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 16,
  fontWeight: "700" as const,
  color: colors.ink,
};

const labelStyle = {
  fontSize: 11,
  fontWeight: "900" as const,
  letterSpacing: 1.5,
  color: colors.ink,
  marginBottom: 6,
  textTransform: "uppercase" as const,
};

export default function CreateScreen() {
  const [title, setTitle] = useState("");
  const [props, setProps] = useState<string[]>([""]);

  const addProp = () => setProps((p) => [...p, ""]);
  const updateProp = (i: number, v: string) =>
    setProps((p) => p.map((x, idx) => (idx === i ? v : x)));

  return (
    <ScreenFrame
      title="New Event"
      subtitle="Spin up a market. Give the chaos a stage."
      accent="pink"
    >
      <BrutalCard bg="chalk">
        <Text style={labelStyle}>Event Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Mark's Birthday Rager"
          placeholderTextColor="#9A9A9A"
          style={inputStyle}
        />

        <Text style={[labelStyle, { marginTop: 16 }]}>Starts At</Text>
        <TextInput
          placeholder="Tonight · 9:00 PM"
          placeholderTextColor="#9A9A9A"
          style={inputStyle}
        />
      </BrutalCard>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 16 }}>
        <View style={{ width: 16, height: 16, backgroundColor: colors.ink, marginRight: 8 }} />
        <Text style={{ fontSize: 14, fontWeight: "900", letterSpacing: 2, color: colors.ink }}>
          PROPOSITIONS
        </Text>
        <View style={{ flex: 1, height: border.thick, backgroundColor: colors.ink, marginLeft: 12 }} />
      </View>

      {props.map((p, i) => (
        <BrutalCard key={i} bg={i % 2 === 0 ? "lime" : "violet"}>
          <Text style={labelStyle}>PROP #{i + 1}</Text>
          <TextInput
            value={p}
            onChangeText={(v) => updateProp(i, v)}
            placeholder='e.g. "Mark spills his drink"'
            placeholderTextColor="#5A5A5A"
            multiline
            style={[inputStyle, { minHeight: 60, textAlignVertical: "top" }]}
          />
        </BrutalCard>
      ))}

      <BrutalButton label="+ Add Prop" onPress={addProp} bg="chalk" fullWidth />

      <View style={{ height: 24 }} />

      <BrutalButton label="Launch Event" onPress={() => {}} bg="lime" fullWidth />
    </ScreenFrame>
  );
}
