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
import { colors, radius } from "@/theme/tokens";
import { Pack, PACKS } from "@/lib/packs";
import { BrutalButton } from "./BrutalButton";

type Props = {
  /** Called with the prop strings the user picked from a pack. */
  onApply: (props: string[], packName: string) => void;
};

function PackChip({ pack, onPress }: { pack: Pack; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.lg,
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginRight: 10,
        width: 200,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 22 }}>{pack.emoji}</Text>
        {pack.adult ? (
          <View
            style={{
              marginLeft: 8,
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
          fontSize: 14,
          fontWeight: "700",
          color: colors.text,
          marginTop: 8,
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
        }}
        numberOfLines={2}
      >
        {pack.tagline}
      </Text>
      <Text
        style={{
          marginTop: 8,
          fontSize: 11,
          fontWeight: "600",
          color: colors.primary,
        }}
      >
        {pack.props.length} props →
      </Text>
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

  const toggle = (i: number) =>
    setSelected((s) => ({ ...s, [i]: !s[i] }));
  const allOn = pack.props.every((_, i) => selected[i]);
  const toggleAll = () =>
    setSelected(
      Object.fromEntries(pack.props.map((_, i) => [i, !allOn]))
    );

  const count = Object.values(selected).filter(Boolean).length;

  const apply = () => {
    const picks = pack.props.filter((_, i) => selected[i]);
    onApply(picks);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}
    >
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
          <Text style={{ color: colors.textMuted, fontWeight: "600", fontSize: 15 }}>
            Cancel
          </Text>
        </Pressable>
        <Pressable onPress={toggleAll}>
          <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 14 }}>
            {allOn ? "Unselect all" : "Select all"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 32 }}>{pack.emoji}</Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: colors.text,
            marginTop: 8,
            letterSpacing: -0.3,
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
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}
                  >
                    ✓
                  </Text>
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
      // Cross-platform confirm: Alert.alert on native, window.confirm on web.
      const ok = () => setOpenPack(pack);
      if (Platform.OS === "web") {
        // eslint-disable-next-line no-alert
        if (typeof window !== "undefined" && window.confirm("This pack is for adult party games. Continue?")) {
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
