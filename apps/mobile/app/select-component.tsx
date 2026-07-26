import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { demoAccessories } from "@fitment/catalog";

import { ModalScreen } from "../src/components/ui";
import { categoryLabel, money, statusPresentation } from "../src/presentation";
import { useFitment } from "../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../src/theme";

export default function SelectComponentScreen() {
  const router = useRouter();
  const { selectedAccessory, selectAccessory, evaluations } = useFitment();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(demoAccessories.map((product) => product.category))],
    [],
  );

  const results = demoAccessories.filter((product) => {
    if (category && product.category !== category) return false;
    if (!query.trim()) return true;
    const haystack = `${product.manufacturer} ${product.family} ${product.exactModel}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  function choose(id: string) {
    selectAccessory(id);
    router.back();
  }

  return (
    <ModalScreen title="Choose component" scroll={false}>
      <View style={styles.searchWrap}>
        <View style={styles.searchField}>
          <Ionicons name="search" size={16} color={colors.inkFaint} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search brand or model"
            placeholderTextColor={colors.inkFaint}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          <Chip label="All" active={category === null} onPress={() => setCategory(null)} />
          {categories.map((item) => (
            <Chip
              key={item}
              label={categoryLabel(item)}
              active={category === item}
              onPress={() => setCategory(category === item ? null : item)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {results.length === 0 ? (
          <Text style={styles.noResults}>No components match this search.</Text>
        ) : (
          results.map((product) => {
            const selected = product.id === selectedAccessory.id;
            const evaluation = evaluations.get(product.id);
            const status = evaluation ? statusPresentation(evaluation) : null;
            return (
              <Pressable
                key={product.id}
                accessibilityRole="button"
                onPress={() => choose(product.id)}
                style={({ pressed }) => [
                  styles.row,
                  selected ? styles.rowSelected : null,
                  pressed ? styles.pressed : null,
                ]}
              >
                <View style={styles.thumb}>
                  <Ionicons name="image-outline" size={18} color={colors.inkFaint} />
                </View>
                <View style={styles.rowCopy}>
                  <Text style={styles.brand}>{product.manufacturer}</Text>
                  <Text style={styles.model}>{product.exactModel}</Text>
                  <Text style={styles.meta}>
                    {categoryLabel(product.category)} · {money(product.knownPriceCents)}
                  </Text>
                  {status ? (
                    <Text style={[styles.status, { color: status.foreground }]}>{status.label}</Text>
                  ) : null}
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
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  searchField: {
    minHeight: 40,
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
  noResults: {
    color: colors.inkSoft,
    fontFamily,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: spacing.xl,
  },
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
  status: { fontFamily, fontSize: 12, fontWeight: "600", marginTop: 3 },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  checkSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
});
