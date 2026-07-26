import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { FirearmCanvas } from "../../src/components/FirearmCanvas";
import {
  AppHeader,
  Badge,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from "../../src/components/ui";
import {
  categoryLabel,
  money,
  resultHeadline,
  statusPresentation,
} from "../../src/presentation";
import { useFitment } from "../../src/state/FitmentProvider";
import { colors, fontFamily, radius, spacing } from "../../src/theme";

export default function BuilderScreen() {
  const router = useRouter();
  const {
    accessories,
    selectedHost,
    selectedAccessory,
    evaluation,
    evaluations,
    requiredProducts,
    buildItems,
    blocked,
    selectAccessory,
    addSelected,
  } = useFitment();
  const presentation = statusPresentation(evaluation);
  const alreadyAdded = buildItems.some((item) => item.id === selectedAccessory.id);

  return (
    <Screen>
      <AppHeader title="Builder" subtitle="See the setup. Change a part. Check the fit." />

      <FirearmCanvas
        host={selectedHost}
        accessory={selectedAccessory}
        evaluation={evaluation}
        requiredProducts={requiredProducts}
        onSelectFirearm={() => router.push("/select-firearm")}
        onSelectComponent={() => router.push("/select-component")}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Components</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/select-component")}
          style={({ pressed }) => [styles.browseButton, pressed ? styles.pressed : null]}
        >
          <Text style={styles.browseText}>Browse all</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.inkSoft} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.componentTray}
      >
        {accessories.map((product) => {
          const active = product.id === selectedAccessory.id;
          const productEvaluation = evaluations.get(product.id);
          const productStatus = productEvaluation ? statusPresentation(productEvaluation) : null;
          return (
            <Pressable
              key={product.id}
              accessibilityRole="button"
              onPress={() => selectAccessory(product.id)}
              style={({ pressed }) => [
                styles.componentTile,
                active ? styles.componentTileActive : null,
                pressed ? styles.pressed : null,
              ]}
            >
              <View style={[styles.componentThumb, active ? styles.componentThumbActive : null]}>
                <Ionicons
                  name={product.category === "RED_DOT_OPTIC" ? "scan-outline" : "flashlight-outline"}
                  size={20}
                  color={active ? colors.white : colors.inkSoft}
                />
              </View>
              <Text style={styles.componentCategory}>{categoryLabel(product.category)}</Text>
              <Text style={styles.componentName} numberOfLines={2}>{product.family}</Text>
              <View style={styles.componentMetaRow}>
                <Text style={styles.componentPrice}>{money(product.knownPriceCents)}</Text>
                {productStatus ? (
                  <View style={[styles.miniStatus, { backgroundColor: productStatus.foreground }]} />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.resultPanel}>
        <View style={styles.resultTop}>
          <Badge
            label={presentation.label}
            foreground={presentation.foreground}
            background={presentation.background}
          />
          <View style={styles.scoreBlock}>
            <Text style={styles.score}>{evaluation.confidenceScore}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
        </View>
        <Text style={styles.resultTitle}>{resultHeadline(evaluation)}</Text>

        {requiredProducts.length > 0 ? (
          <View style={styles.requiredRow}>
            <View style={styles.requiredIcon}>
              <Ionicons name="layers-outline" size={16} color={colors.accent} />
            </View>
            <View style={styles.requiredCopy}>
              <Text style={styles.requiredLabel}>Required part</Text>
              <Text style={styles.requiredName} numberOfLines={1}>
                {requiredProducts.map((product) => product.family).join(", ")}
              </Text>
            </View>
            <Text style={styles.requiredPrice}>
              {money(requiredProducts.reduce((sum, product) => sum + (product.knownPriceCents ?? 0), 0))}
            </Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <PrimaryButton
            label={
              blocked
                ? "Cannot add"
                : alreadyAdded
                  ? "Already added"
                  : requiredProducts.length > 0
                    ? "Add setup"
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
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/armory")}
        style={({ pressed }) => [styles.buildStrip, pressed ? styles.pressed : null]}
      >
        <View style={styles.buildIcon}>
          <Ionicons name="albums-outline" size={16} color={colors.inkSoft} />
        </View>
        <View style={styles.buildCopy}>
          <Text style={styles.buildTitle}>Current build</Text>
          <Text style={styles.buildMeta}>
            {buildItems.length} component{buildItems.length === 1 ? "" : "s"}
          </Text>
        </View>
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
  browseButton: { minHeight: 32, flexDirection: "row", alignItems: "center", gap: 2 },
  browseText: { color: colors.inkSoft, fontFamily, fontSize: 12, fontWeight: "600" },
  pressed: { opacity: 0.66 },
  componentTray: { gap: spacing.xs, paddingRight: spacing.md },
  componentTile: {
    width: 126,
    minHeight: 138,
    padding: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  componentTileActive: { borderColor: colors.accent, borderWidth: 1.25 },
  componentThumb: {
    height: 58,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  componentThumbActive: { backgroundColor: colors.ink },
  componentCategory: {
    color: colors.inkFaint,
    fontFamily,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 7,
  },
  componentName: { color: colors.ink, fontFamily, fontSize: 13, lineHeight: 16, fontWeight: "600", marginTop: 2 },
  componentMetaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto" },
  componentPrice: { color: colors.inkSoft, fontFamily, fontSize: 11 },
  miniStatus: { width: 6, height: 6, borderRadius: 3 },
  resultPanel: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  resultTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  scoreBlock: { flexDirection: "row", alignItems: "baseline" },
  score: { color: colors.ink, fontFamily, fontSize: 18, fontWeight: "600" },
  scoreMax: { color: colors.inkFaint, fontFamily, fontSize: 11, marginLeft: 1 },
  resultTitle: { color: colors.ink, fontFamily, fontSize: 16, lineHeight: 21, fontWeight: "600" },
  requiredRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
  },
  requiredIcon: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.accentSoft },
  requiredCopy: { flex: 1 },
  requiredLabel: { color: colors.inkFaint, fontFamily, fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },
  requiredName: { color: colors.ink, fontFamily, fontSize: 13, fontWeight: "600", marginTop: 1 },
  requiredPrice: { color: colors.inkSoft, fontFamily, fontSize: 12 },
  actions: { gap: spacing.xs },
  buildStrip: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  buildIcon: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  buildCopy: { flex: 1 },
  buildTitle: { color: colors.ink, fontFamily, fontSize: 13, fontWeight: "600" },
  buildMeta: { color: colors.inkFaint, fontFamily, fontSize: 11, marginTop: 1 },
});
