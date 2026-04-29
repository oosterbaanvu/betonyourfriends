import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme/tokens";
import { Pack, PACKS } from "@/lib/packs";
import { BrutalButton } from "./BrutalButton";

type Props = {
  onApply: (props: string[], packName: string) => void;
};

function PackChip({ pack, onPress }: { pack: Pack; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.lg,
        marginRight: 10,
        width: 220,
        overflow: "hidden",
        opacity: pressed ? 0.95 : 1,
      })}
    >
      {/* Top accent stripe */}
      <View
        style={{
          height: 4,
          backgroundColor: pack.accent,
        }}
      />
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.sm,
              backgroundColor: pack.accent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontWeight: "800",
                fontSize: 13,
                letterSpacing: 0.5,
              }}
            >
              {pack.monogram}
            </Text>
          </View>
          {pack.adult ? (
            <View
              style={{
                marginLeft: "auto",
                backgroundColor: colors.noFaint,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: radius.pill,
              }}
            >
              <Text
                style={{
                  color: colors.no,
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 0.4,
                }}
              >
                18+
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: colors.text,
            marginTop: 10,
            letterSpacing: -0.2,
          }}
          numberOfLines={1}
        >
          {pack.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.textMuted,
            marginTop: 2,
            lineHeight: 16,
          }}
          numberOfLines={2}
        >
          {pack.tagline}
        </Text>
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: pack.accent,
              letterSpacing: 0.5,
            }}
          >
            {pack.props.length} props
          </Text>
          <Ionicons
            name="arrow-forward"
            size={12}
            color={pack.accent}
            style={{ marginLeft: 4 }}
          />
        </View>
      </View>
    </Pressable>
  );
}

function PackDetail({
  pack,
  onClose,
  onApply,
}: {
  pack: Pack;
  onClose: () => void;
  onApply: (selected: string[]) => void;
}) {
  const [selected, setSelected] = useState<Record<number, boolean>>(
    Object.fromEntries(pack.props.map((_, i) => [i, true]))
  );

  const toggle = (i: number) => setSelected((s) => ({ ...s, [i]: !s[i] }));
  const allOn = pack.props.every((_, i) => selected[i]);
  const toggleAll = () =>
    setSelected(Object.fromEntries(pack.props.map((_, i) => [i, !allOn])));

  const count = Object.values(selected).filter(Boolean).length;
  const apply = () => onApply(pack.props.filter((_, i) => selected[i]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={onClose}>
          <Text
            style={{ color: colors.textMuted, fontWeight: "600", fontSize: 15 }}
          >
            Cancel
          </Text>
        </Pressable>
        <Pressable onPress={toggleAll}>
          <Text
            style={{ color: colors.primary, fontWeight: "600", fontSize: 14 }}
          >
            {allOn ? "Unselect all" : "Select all"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.md,
            backgroundColor: pack.accent,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontWeight: "800",
              fontSize: 18,
              letterSpacing: 1,
            }}
          >
            {pack.monogram}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: colors.text,
            marginTop: 12,
            letterSpacing: -0.4,
          }}
        >
          {pack.name}
        </Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }}>
          {pack.tagline}
        </Text>

        <View style={{ height: 18 }} />

        {pack.props.map((p, i) => {
          const isOn = !!selected[i];
          return (
            <Pressable
              key={i}
              onPress={() => toggle(i)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: radius.sm,
                  borderWidth: 1.5,
                  borderColor: isOn ? colors.primary : colors.borderStrong,
                  backgroundColor: isOn ? colors.primary : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isOn ? (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                ) : null}
              </View>
              <Text
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 15,
                  color: colors.text,
                  fontWeight: "500",
                }}
              >
                {p}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.bg,
        }}
      >
        <BrutalButton
          label={count === 0 ? "Pick at least one" : `Add ${count} props`}
          onPress={count === 0 ? undefined : apply}
          variant="primary"
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

export function PackPicker({ onApply }: Props) {
  const [openPack, setOpenPack] = useState<Pack | null>(null);

  const tryOpen = (pack: Pack) => {
    if (pack.adult) {
      const ok = () => setOpenPack(pack);
      if (Platform.OS === "web") {
        if (
          typeof window !== "undefined" &&
          window.confirm("This pack is for adult party games. Continue?")
        ) {
          ok();
        }
        return;
      }
      Alert.alert(
        "Adults only",
        "This pack is for adult party games. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", onPress: ok },
        ]
      );
      return;
    }
    setOpenPack(pack);
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4, paddingRight: 16 }}
      >
        {PACKS.map((p) => (
          <PackChip key={p.id} pack={p} onPress={() => tryOpen(p)} />
        ))}
      </ScrollView>

      <Modal
        visible={openPack !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setOpenPack(null)}
      >
        {openPack ? (
          <PackDetail
            pack={openPack}
            onClose={() => setOpenPack(null)}
            onApply={(picks) => {
              onApply(picks, openPack.name);
              setOpenPack(null);
            }}
          />
        ) : null}
      </Modal>
    </View>
  );
}
