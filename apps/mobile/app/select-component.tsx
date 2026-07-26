import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { demoAccessories } from "@fitment/catalog";

import { categoryLabel, money } from "../src/presentation";
import { useFitment } from "../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../src/theme";

export default function SelectComponentScreen() {
  const router = useRouter();
  const { selectedAccessory, selectAccessory } = useFitment();

  function choose(id: string) {
    selectAccessory(id);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>BUILDER</Text>
          <Text style={styles.title}>Choose component</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.close, pressed ? styles.pressed : null]}
        >
          <Ionicons name="close" size={21} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.helper}>Select the exact catalog variant. Broad product-family guesses are not used.</Text>

        {demoAccessories.map((product) => {
          const selected = product.id === selectedAccessory.id;
          return (
            <Pressable
              key={product.id}
              accessibilityRole="button"
              onPress={() => choose(product.id)}
              style={({ pressed }) => [
                styles.option,
                selected ? styles.optionSelected : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <View style={styles.optionTop}>
                <View style={styles.optionCopy}>
                  <Text style={styles.manufacturer}>{product.manufacturer}</Text>
                  <Text style={styles.optionTitle}>{product.exactModel}</Text>
                </View>
                <View style={selected ? styles.checkSelected : styles.check}>
                  {selected ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}
                </View>
              </View>
              <Text style={styles.category}>{categoryLabel(product.category)}</Text>
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>PRICE</Text>
                  <Text style={styles.statValue}>{money(product.knownPriceCents)}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>WEIGHT</Text>
                  <Text style={styles.statValue}>{product.knownWeightGrams === undefined ? "Unknown" : `${product.knownWeightGrams} g`}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { minHeight: 84, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, paddingHorizontal: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  eyebrow: { color: colors.inkFaint, fontFamily, fontSize: 10, fontWeight: "700", letterSpacing: 1.4 },
  title: { color: colors.ink, fontFamily, fontSize: 26, fontWeight: "700", letterSpacing: -0.5, marginTop: 4 },
  close: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  helper: { color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20, marginBottom: spacing.lg },
  option: { padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, marginBottom: spacing.sm },
  optionSelected: { borderColor: colors.accent, borderWidth: 1.5 },
  pressed: { opacity: 0.7 },
  optionTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  optionCopy: { flex: 1 },
  manufacturer: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  optionTitle: { color: colors.ink, fontFamily, fontSize: 16, lineHeight: 21, fontWeight: "600", marginTop: 3 },
  category: { color: colors.accent, fontFamily, fontSize: 11, fontWeight: "600", marginTop: spacing.sm },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: colors.line },
  checkSelected: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent },
  stats: { minHeight: 60, flexDirection: "row", alignItems: "center", marginTop: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  stat: { flex: 1, alignItems: "center" },
  statLabel: { color: colors.inkFaint, fontFamily, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  statValue: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600", marginTop: 4 },
  statDivider: { width: StyleSheet.hairlineWidth, height: 30, backgroundColor: colors.line },
});
