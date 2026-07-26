import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ModalScreen } from "../src/components/ui";
import { categoryLabel, interfaceLabel, money } from "../src/presentation";
import { useFitment } from "../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../src/theme";

export default function SelectFirearmScreen() {
  const router = useRouter();
  const { firearms, selectedHost, selectHost } = useFitment();
  const [query, setQuery] = useState("");
  const [manufacturer, setManufacturer] = useState<string | null>(null);

  const manufacturers = useMemo(
    () => [...new Set(firearms.map((firearm) => firearm.manufacturer))],
    [firearms],
  );

  const results = firearms.filter((firearm) => {
    if (manufacturer && firearm.manufacturer !== manufacturer) return false;
    if (!query.trim()) return true;
    const haystack = `${firearm.manufacturer} ${firearm.family} ${firearm.exactModel} ${firearm.sku ?? ""}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  function choose(id: string) {
    selectHost(id);
    router.back();
  }

  return (
    <ModalScreen title="Choose exact firearm" scroll={false}>
      <View style={styles.searchWrap}>
        <Text style={styles.helper}>
          Compatibility is recalculated for the exact variant you select. Changing firearms clears the current unsaved build.
        </Text>
        <View style={styles.searchField}>
          <Ionicons name="search" size={16} color={colors.inkFaint} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search manufacturer or model"
            placeholderTextColor={colors.inkFaint}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All" active={manufacturer === null} onPress={() => setManufacturer(null)} />
          {manufacturers.map((item) => (
            <Chip
              key={item}
              label={item}
              active={manufacturer === item}
              onPress={() => setManufacturer(manufacturer === item ? null : item)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {results.length === 0 ? (
          <Text style={styles.noResults}>No exact firearm variants match this search.</Text>
        ) : (
          results.map((firearm) => {
            const selected = firearm.id === selectedHost.id;
            return (
              <Pressable
                key={firearm.id}
                accessibilityRole="button"
                onPress={() => choose(firearm.id)}
                style={({ pressed }) => [
                  styles.row,
                  selected ? styles.rowSelected : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <View style={styles.thumb}>
                  <Ionicons name="barcode-outline" size={19} color={colors.inkSoft} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.brand}>{firearm.manufacturer}</Text>
                  <Text style={styles.model}>{firearm.exactModel}</Text>
                  <Text style={styles.meta}>
                    {categoryLabel(firearm.category)} · {money(firearm.knownPriceCents)} · {firearm.knownWeightGrams ?? "—"} g
                  </Text>
                  <Text style={styles.interfaces} numberOfLines={2}>
                    {firearm.provides.map((item) => interfaceLabel(item.interfaceId)).join(" · ")}
                  </Text>
                </View>
                <View style={selected ? styles.checkSelected : styles.check}>
                  {selected ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </ModalScreen>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.chip, active ? styles.chipActive : null, pressed ? styles.pressed : null]}
    >
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchWrap: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.xs },
  helper: { color: colors.inkSoft, fontFamily, fontSize: 13, lineHeight: 18 },
  searchField: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  searchInput: { flex: 1, color: colors.ink, fontFamily, fontSize: 15, paddingVertical: 8 },
  chips: { gap: spacing.xs, paddingVertical: 2 },
  chip: {
    minHeight: 32,
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.inkSoft, fontFamily, fontSize: 13, fontWeight: "500" },
  chipTextActive: { color: colors.white },
  list: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.xs },
  noResults: { color: colors.inkSoft, fontFamily, fontSize: 14, textAlign: "center", paddingVertical: spacing.xl },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  rowSelected: { borderColor: colors.accent, borderWidth: 1 },
  pressed: { opacity: 0.7 },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  rowCopy: { flex: 1 },
  brand: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  model: { color: colors.ink, fontFamily, fontSize: 15, lineHeight: 20, fontWeight: "600", marginTop: 1 },
  meta: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 3 },
  interfaces: { color: colors.inkFaint, fontFamily, fontSize: 11, lineHeight: 15, marginTop: 3 },
  check: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.line },
  checkSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
});
