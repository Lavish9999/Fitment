import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { demoHost } from "@fitment/catalog";

import {
  AppHeader,
  Badge,
  Card,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionTitle,
  SelectorRow,
} from "../../src/components/ui";
import {
  categoryLabel,
  confidenceNote,
  money,
  resultExplanation,
  resultHeadline,
  statusPresentation,
} from "../../src/presentation";
import { useFitment } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

export default function BuilderScreen() {
  const router = useRouter();
  const { selectedAccessory, evaluation, requiredProducts, buildItems, blocked, addSelected } =
    useFitment();
  const presentation = statusPresentation(evaluation);
  const alreadyAdded = buildItems.some((item) => item.id === selectedAccessory.id);

  return (
    <Screen>
      <AppHeader title="Builder" subtitle="Pick an exact pair, then review the result." />

      <SectionTitle>Firearm</SectionTitle>
      <SelectorRow
        icon="barcode-outline"
        eyebrow={demoHost.manufacturer}
        title={demoHost.exactModel}
        detail={`${money(demoHost.knownPriceCents)} · ${demoHost.knownWeightGrams ?? "—"} g`}
        onPress={() => router.push("/select-firearm")}
      />

      <SectionTitle>Component</SectionTitle>
      <SelectorRow
        icon="cube-outline"
        eyebrow={`${selectedAccessory.manufacturer} · ${categoryLabel(selectedAccessory.category)}`}
        title={selectedAccessory.exactModel}
        detail={money(selectedAccessory.knownPriceCents)}
        onPress={() => router.push("/select-component")}
      />

      <SectionTitle>Result</SectionTitle>
      <Card>
        <Badge
          label={presentation.label}
          foreground={presentation.foreground}
          background={presentation.background}
        />
        <Text style={styles.resultTitle}>{resultHeadline(evaluation)}</Text>
        <Text style={styles.resultBody}>{resultExplanation(evaluation, selectedAccessory)}</Text>

        {requiredProducts.length > 0 ? (
          <View style={styles.requiredBlock}>
            <Text style={styles.requiredLabel}>Required</Text>
            {requiredProducts.map((product) => (
              <View key={product.id} style={styles.requiredRow}>
                <Ionicons name="add-circle" size={16} color={colors.accent} />
                <Text style={styles.requiredName}>{product.family}</Text>
                <Text style={styles.requiredPrice}>{money(product.knownPriceCents)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.confidenceRow}>
          <Text style={styles.confidenceLabel}>Confidence</Text>
          <Text style={styles.confidenceValue}>{confidenceNote(evaluation)}</Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label={
              blocked
                ? "Cannot add this component"
                : alreadyAdded
                  ? "Already in build"
                  : requiredProducts.length > 0
                    ? "Add with required parts"
                    : "Add to build"
            }
            icon={blocked || alreadyAdded ? undefined : "add"}
            disabled={blocked || alreadyAdded}
            onPress={() => addSelected(true)}
          />
          <SecondaryButton
            label="View compatibility details"
            onPress={() => router.push("/compatibility-details")}
          />
        </View>
      </Card>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/armory")}
        style={({ pressed }) => [styles.buildShortcut, pressed ? styles.pressed : null]}
      >
        <Ionicons name="albums-outline" size={18} color={colors.inkSoft} />
        <Text style={styles.shortcutText}>
          Current build · {buildItems.length} component{buildItems.length === 1 ? "" : "s"}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  resultTitle: {
    color: colors.ink,
    fontFamily,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "600",
    letterSpacing: -0.3,
    marginTop: spacing.sm,
  },
  resultBody: {
    color: colors.inkSoft,
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  requiredBlock: {
    marginTop: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  requiredLabel: {
    color: colors.inkFaint,
    fontFamily,
    fontSize: 12,
    fontWeight: "600",
    marginTop: spacing.xxs,
  },
  requiredRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  requiredName: { flex: 1, color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  requiredPrice: { color: colors.inkSoft, fontFamily, fontSize: 13 },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  confidenceLabel: { color: colors.inkFaint, fontFamily, fontSize: 13 },
  confidenceValue: { color: colors.inkSoft, fontFamily, fontSize: 13, fontWeight: "600" },
  actions: { gap: spacing.xs, marginTop: spacing.md },
  buildShortcut: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  pressed: { opacity: 0.7 },
  shortcutText: { flex: 1, color: colors.inkSoft, fontFamily, fontSize: 14, fontWeight: "500" },
});
