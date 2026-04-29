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
import { colors, border } from "@/theme/tokens";
import { Pack, PACKS } from "@/lib/packs";
import { BrutalButton } from "./BrutalButton";

type Props = {
  onApply: (props: string[], packName: string) => void;
};

function PackChip({ pack, onPress }: { pack: Pack; onPress: () => void }) {
  return (
    <View
      style={{
        position: "relative",
        marginRight: 12,
        marginBottom: 6,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 5,
          left: 5,
          right: -5,
          bottom: -5,
          backgroundColor: colors.ink,
        }}
      />
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: colors.chalk,
          borderColor: colors.ink,
          borderWidth: border.brutal,
          width: 220,
          overflow: "hidden",
        }}
      >
        <View style={{ height: 8, backgroundColor: pack.accent }} />
        <View style={{ padding: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                backgroundColor: pack.accent,
                borderColor: colors.ink,
                borderWidth: border.thick,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.chalk,
                  fontWeight: "900",
                  fontSize: 14,
                  letterSpacing: 1.2,
                  fontFamily: "Courier",
                }}
              >
                {pack.monogram}
              </Text>
            </View>
            {pack.adult ? (
              <View
                style={{
                  marginLeft: "auto",
                  backgroundColor: colors.blood,
                  borderColor: colors.ink,
                  borderWidth: border.thick,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    color: colors.chalk,
                    fontSize: 10,
                    fontWeight: "900",
                    letterSpacing: 0.8,
                  }}
                >
                  18+
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "900",
              color: colors.ink,
              marginTop: 12,
              letterSpacing: -0.3,
              textTransform: "uppercase",
            }}
            numberOfLines={1}
          >
            {pack.name}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: colors.textMuted,
              marginTop: 2,
              lineHeight: 15,
              fontFamily: "Courier",
              fontWeight: "700",
            }}
            numberOfLines={2}
          >
            {pack.tagline}
          </Text>
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "900",
                color: pack.accent,
                letterSpacing: 1.2,
              }}
            >
              {pack.props.length} PROPS
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
    </View>
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
    <View style={{ flex: 1, backgroundColor: colors.bone }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 14,
          backgroundColor: colors.chalk,
          borderBottomColor: colors.ink,
          borderBottomWidth: border.brutal,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable onPress={onClose}>
          <Text
            style={{
              color: colors.ink,
              fontWeight: "900",
              fontSize: 13,
              letterSpacing: 1.4,
            }}
          >
            CANCEL
          </Text>
        </Pressable>
        <Pressable onPress={toggleAll}>
          <Text
            style={{
              color: colors.ink,
              fontWeight: "900",
              fontSize: 13,
              letterSpacing: 1.4,
            }}
          >
            {allOn ? "UNSELECT ALL" : "SELECT ALL"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View
          style={{
            width: 64,
            height: 64,
            backgroundColor: pack.accent,
            borderColor: colors.ink,
            borderWidth: border.brutal,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.chalk,
              fontWeight: "900",
              fontSize: 18,
              letterSpacing: 1.2,
              fontFamily: "Courier",
            }}
          >
            {pack.monogram}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "900",
            color: colors.ink,
            marginTop: 14,
            letterSpacing: -0.6,
            textTransform: "uppercase",
          }}
        >
          {pack.name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.textMuted,
            marginTop: 4,
            fontFamily: "Courier",
            fontWeight: "700",
          }}
        >
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
                borderBottomColor: colors.ink,
                borderBottomWidth: border.hairline,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderColor: colors.ink,
                  borderWidth: border.thick,
                  backgroundColor: isOn ? pack.accent : colors.chalk,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isOn ? (
                  <Ionicons name="checkmark" size={14} color={colors.chalk} />
                ) : null}
              </View>
              <Text
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 15,
                  color: colors.ink,
                  fontWeight: "700",
                  letterSpacing: -0.2,
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
          backgroundColor: colors.chalk,
          borderTopColor: colors.ink,
          borderTopWidth: border.brutal,
        }}
      >
        <BrutalButton
          label={count === 0 ? "Pick at least one" : `Add ${count} props`}
          onPress={count === 0 ? undefined : apply}
          variant="yes"
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
        contentContainerStyle={{ paddingVertical: 6, paddingRight: 16 }}
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
