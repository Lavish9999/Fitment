import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { demoHost } from "@fitment/catalog";

import {
  AppHeader,
  Badge,
  Card,
  ChevronRow,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionTitle,
} from "../../src/components/ui";
import { categoryLabel, money, statusPresentation, unresolvedChecks } from "../../src/presentation";
import { useFitment } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

export default function BuilderScreen() {
  const router = useRouter();
  const {
    selectedAccessory,
    evaluation,
    requiredProducts,
    buildItems,
    blocked,
    addSelected,
  } = useFitment();
  const presentation = statusPresentation(evaluation);
  const unresolved = unresolvedChecks(evaluation);

  return (
    <Screen>
      <AppHeader title="Builder" subtitle="Choose an exact pair. Review the result. Add it once." />

      <View style={styles.progress}>
        {[
          ["1", "Firearm"],
          ["2", "Component"],
          ["3", "Result"],
        ].map(([number, label], index) => (
          <View key={number} style={styles.progressItem}>
            <View style={[styles.progressDot, index === 2 ? styles.progressDotActive : null]}>
              <Text style={[styles.progressNumber, index === 2 ? styles.progressNumberActive : null]}>{number}</Text>
            </View>
            <Text style={styles.progressLabel}>{label}</Text>
          </View>
        ))}
      </View>

      <SectionTitle>Exact firearm</SectionTitle>
      <Card style={styles.compactCard}>
        <View style={styles.iconBox}>
          <Ionicons name="barcode-outline" size={20} color={colors.ink} />
        </View>
        <View style={styles.cardCopy}>
          <Text style={styles.maker}>{demoHost.manufacturer}</Text>
          <Text style={styles.itemTitle} numberOfLines={1}>{demoHost.exactModel}</Text>
          <Text style={styles.itemMeta}>{money(demoHost.knownPriceCents)} · {demoHost.knownWeightGrams ?? "—"} g</Text>
        </View>
        <Badge label="EXACT" />
      </Card>

      <SectionTitle>Component</SectionTitle>
      <ChevronRow
        eyebrow={selectedAccessory.manufacturer}
        title={selectedAccessory.exactModel}
        detail={`${categoryLabel(selectedAccessory.category)} · ${money(selectedAccessory.knownPriceCents)}`}
        onPress={() => router.push("/select-component")}
      />

      <SectionTitle>Compatibility</SectionTitle>
      <Card>
        <View style={styles.resultTop}>
          <Badge
            label={presentation.label}
            foreground={presentation.foreground}
            background={presentation.background}
          />
          <Text style={styles.score}>{evaluation.confidenceScore}</Text>
        </View>

        <Text style={styles.resultTitle} numberOfLines={3}>{evaluation.summary}</Text>
        <Text style={styles.resultBody}>
          {requiredProducts.length > 0
            ? `${requiredProducts.length} required part${requiredProducts.length === 1 ? "" : "s"} identified.`
            : unresolved.length > 0
              ? `${unresolved.length} unresolved check${unresolved.length === 1 ? "" : "s"}.`
              : "No additional part is currently identified."}
        </Text>

        <View style={styles.resultStrip}>
          <View style={styles.resultStat}>
            <Text style={styles.statLabel}>Required</Text>
            <Text style={styles.statValue}>{requiredProducts.length}</Text>
          </View>
          <View style={styles.resultDivider} />
          <View style={styles.resultStat}>
            <Text style={styles.statLabel}>Unresolved</Text>
            <Text style={styles.statValue}>{unresolved.length}</Text>
          </View>
          <View style={styles.resultDivider} />
          <View style={styles.resultStat}>
            <Text style={styles.statLabel}>In build</Text>
            <Text style={styles.statValue}>{buildItems.length}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label={
              blocked
                ? "Cannot add"
                : requiredProducts.length > 0
                  ? "Add with required parts"
                  : "Add to build"
            }
            icon="add"
            disabled={blocked}
            onPress={() => addSelected(true)}
          />
          <SecondaryButton
            label="View evidence and checks"
            icon="document-text-outline"
            onPress={() => router.push("/compatibility-details")}
          />
        </View>
      </Card>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/armory")}
        style={({ pressed }) => [styles.buildShortcut, pressed ? styles.pressed : null]}
      >
        <View style={styles.shortcutIcon}>
          <Ionicons name="albums-outline" size={20} color={colors.accent} />
        </View>
        <View style={styles.shortcutCopy}>
          <Text style={styles.shortcutTitle}>Current build</Text>
          <Text style={styles.shortcutBody}>{buildItems.length} components · manage in Armory</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={colors.inkSoft} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 8, marginBottom: spacing.sm },
  progressItem: { alignItems: "center", gap: 5, flex: 1 },
  progressDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  progressDotActive: { backgroundColor: colors.ink },
  progressNumber: { color: colors.inkSoft, fontFamily, fontSize: 12, fontWeight: "600" },
  progressNumberActive: { color: colors.white },
  progressLabel: { color: colors.inkFaint, fontFamily, fontSize: 11 },
  compactCard: { minHeight: 82, flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconBox: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceMuted },
  cardCopy: { flex: 1 },
  maker: { color: colors.inkFaint, fontFamily, fontSize: 12 },
  itemTitle: { color: colors.ink, fontFamily, fontSize: 15, fontWeight: "600", marginTop: 2 },
  itemMeta: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 5 },
  resultTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  score: { color: colors.ink, fontFamily, fontSize: 24, fontWeight: "700", letterSpacing: -0.6 },
  resultTitle: { color: colors.ink, fontFamily, fontSize: 21, lineHeight: 27, fontWeight: "700", letterSpacing: -0.3, marginTop: spacing.lg },
  resultBody: { color: colors.inkSoft, fontFamily, fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
  resultStrip: { minHeight: 70, flexDirection: "row", alignItems: "center", marginTop: spacing.lg, borderRadius: radius.md, backgroundColor: colors.surfaceMuted },
  resultStat: { flex: 1, alignItems: "center" },
  statLabel: { color: colors.inkFaint, fontFamily, fontSize: 11 },
  statValue: { color: colors.ink, fontFamily, fontSize: 17, fontWeight: "700", marginTop: 3 },
  resultDivider: { width: StyleSheet.hairlineWidth, height: 30, backgroundColor: colors.line },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
  buildShortcut: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.lg, paddingHorizontal: spacing.md, borderRadius: radius.lg, backgroundColor: colors.accentSoft },
  pressed: { opacity: 0.7 },
  shortcutIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  shortcutCopy: { flex: 1 },
  shortcutTitle: { color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  shortcutBody: { color: colors.inkSoft, fontFamily, fontSize: 12, marginTop: 3 },
});
