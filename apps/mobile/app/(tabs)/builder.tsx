import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ExactProductVisual } from "../../src/components/ExactProductVisual";
import { SelectedComponentVisual } from "../../src/components/SelectedComponentVisual";
import {
  AppHeader,
  Badge,
  Card,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from "../../src/components/ui";
import { money, resultHeadline, statusPresentation } from "../../src/presentation";
import { useFitment } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

export default function BuilderScreen() {
  const router = useRouter();
  const {
    selectedHost,
    selectedAccessory,
    evaluation,
    requiredProducts,
    buildItems,
    blocked,
    addSelected,
  } = useFitment();
  const presentation = statusPresentation(evaluation);
  const alreadyAdded = buildItems.some((item) => item.id === selectedAccessory.id);
  const installedIds = buildItems.map((item) => item.id);
  const previewId = blocked || alreadyAdded ? undefined : selectedAccessory.id;

  return (
    <Screen>
      <AppHeader title="Builder" subtitle="Exact firearm. Exact component. Clear fit result." />

      <ExactProductVisual
        productVariantId={selectedHost.id}
        productName={selectedHost.exactModel}
        manufacturer={selectedHost.manufacturer}
        installedComponentIds={installedIds}
        previewRequiredComponentIds={alreadyAdded ? [] : requiredProducts.map((product) => product.id)}
        {...(previewId ? { previewComponentId: previewId } : {})}
        onPress={() => router.push("/select-firearm")}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Selected component</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/select-component")}
          hitSlop={10}
        >
          <Text style={styles.changeText}>Change</Text>
        </Pressable>
      </View>

      <SelectedComponentVisual
        productVariantId={selectedAccessory.id}
        manufacturer={selectedAccessory.manufacturer}
        productName={selectedAccessory.exactModel}
        category={selectedAccessory.category}
        priceCents={selectedAccessory.knownPriceCents}
        onPress={() => router.push("/select-component")}
      />

      <Card style={styles.resultCard}>
        <View style={styles.resultTopRow}>
          <Badge
            label={presentation.label}
            foreground={presentation.foreground}
            background={presentation.background}
          />
          <Text style={styles.confidence}>{evaluation.confidenceScore}/100</Text>
        </View>

        <Text style={styles.resultTitle}>{resultHeadline(evaluation)}</Text>

        {requiredProducts.length > 0 ? (
          <View style={styles.requiredBlock}>
            <Text style={styles.requiredLabel}>Required to complete this setup</Text>
            {requiredProducts.map((product) => (
              <View key={product.id} style={styles.requiredRow}>
                <Ionicons name="add-circle" size={16} color={colors.accent} />
                <Text style={styles.requiredName}>{product.family}</Text>
                <Text style={styles.requiredPrice}>{money(product.knownPriceCents)}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={styles.actions}>
          <PrimaryButton
            label={
              blocked
                ? "Cannot add this component"
                : alreadyAdded
                  ? "Already in build"
                  : requiredProducts.length > 0
                    ? "Add component + required part"
                    : "Add component"
            }
            icon={blocked || alreadyAdded ? undefined : "add"}
            disabled={blocked || alreadyAdded}
            onPress={() => addSelected(true)}
          />
          <SecondaryButton
            label="Compatibility details"
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTitle: { color: colors.ink, fontFamily, fontSize: 17, fontWeight: "600" },
  changeText: { color: colors.accent, fontFamily, fontSize: 14, fontWeight: "600" },
  resultCard: { marginTop: spacing.md },
  resultTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  confidence: { color: colors.inkSoft, fontFamily, fontSize: 13, fontWeight: "600" },
  resultTitle: {
    color: colors.ink,
    fontFamily,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginTop: spacing.sm,
  },
  requiredBlock: {
    marginTop: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  requiredLabel: { color: colors.inkFaint, fontFamily, fontSize: 11, fontWeight: "600", marginTop: spacing.xxs },
  requiredRow: { minHeight: 38, flexDirection: "row", alignItems: "center", gap: spacing.xs },
  requiredName: { flex: 1, color: colors.ink, fontFamily, fontSize: 14, fontWeight: "600" },
  requiredPrice: { color: colors.inkSoft, fontFamily, fontSize: 13 },
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
